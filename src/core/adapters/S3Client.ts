import {
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { StorageClient } from '../ports/CreatePreSignedURL';

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
}
