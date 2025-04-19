import {
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { StorageClient } from '../ports/StorageClient';

const MAXIMUM_FILE_SIZE = 209715200; // 200 MB

export class S3StorageClient implements StorageClient {
  private readonly s3Client: S3Client;

  constructor(
    private readonly bucketName: string,
    private readonly region: string,
    private readonly endpoint: string
  ) {
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true,
    });
  }

  async getVideoSignedURL(
    resourceName: string,
    expirationTime: number
  ): Promise<{ url: string; fields: Record<string, string> }> {
    try {
      this.logURLGeneration(resourceName);

      await this.checkBucketExistance();

      const { url, fields } = await createPresignedPost(this.s3Client, {
        Bucket: this.bucketName,
        Key: resourceName,
        Expires: expirationTime,
        Conditions: [
          ['content-length-range', 0, MAXIMUM_FILE_SIZE],
          ['starts-with', '$Content-Type', 'video/'],
        ],
        Fields: {
          'Content-Type': 'video/mp4',
        },
      });

      return { url, fields };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message || (error as any).code
          : 'Unknown error';
      this.logURLGenerationFailed(resourceName, errorMessage);
      throw new Error(`Failed to generate pre-signed URL: ${errorMessage}`);
    }
  }

  async createJSONResource(resourceName: string, resource: any): Promise<void> {
    try {
      await this.checkBucketExistance();

      const params = {
        Bucket: this.bucketName,
        Key: resourceName,
        Body: JSON.stringify(resource),
        ContentType: 'application/json',
      };

      await this.s3Client.send(new PutObjectCommand(params));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message || (error as any).code
          : 'Unknown error';
      throw new Error(`Failed to create resource: ${errorMessage}`);
    }
  }

  async getVideoStatuses(): Promise<string[]> {
    try {
      await this.checkBucketExistance();

      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
      });

      const result = await this.s3Client.send(command);
      return (result.Contents || [])
        .map((object) => object.Key!)
        .filter((key) => key?.endsWith('/status.json'));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message || (error as any).code
          : 'Unknown error';
      throw new Error(`Failed to get video statuses: ${errorMessage}`);
    }
  }

  async retrieveVideoStatusContent(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as ReadableStream | undefined;
    return this.streamToString(stream);
  }
  private async checkBucketExistance() {
    await this.s3Client.send(
      new HeadBucketCommand({ Bucket: this.bucketName })
    );
  }

  private logURLGeneration(uuid: string) {
    console.info(
      '[INFO] - Started Generating S3 Pre-Signed URL.\n' +
        `\tResource Name: ${uuid}.\n` +
        `\tBucket: ${this.bucketName}.\n` +
        `\tTimestamp: ${new Date().toISOString()}`
    );
  }

  private logURLGenerationFailed(uuid: string, errorMessage: string) {
    console.error(
      '[ERROR] - Failed Generating S3 Pre-Signed URL.\n' +
        `\tResource Name: ${uuid}.\n` +
        `\tBucket: ${this.bucketName}.\n` +
        `\tError: ${errorMessage}.\n` +
        `\tTimestamp: ${new Date().toISOString()}`
    );
  }

  private streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: string) => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
  }
}
