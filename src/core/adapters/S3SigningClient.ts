import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { SigningClient } from '../ports/CreatePreSignedURL';

const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;
const MAXIMUM_FILE_SIZE = 209715200; // 200 MB

export class S3SigningClient implements SigningClient {
  private s3Client: S3Client;

  constructor(
    private readonly bucketName: string,
    private readonly region: string,
    private readonly endpoint: string | undefined = undefined
  ) {
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true,
    });
  }

  async getSignedURL(
    uuid: string,
    expirationTime: number
  ): Promise<{ url: string; fields: Record<string, string> }> {
    try {
      this.logURLGeneration(uuid);

      await this.checkBucketExistance();

      const { url, fields } = await createPresignedPost(this.s3Client, {
        Bucket: this.bucketName,
        Key: uuid,
        Expires: expirationTime,
        Conditions: [
          ['content-length-range', 0, MAXIMUM_FILE_SIZE],
          ['starts-with', '$Content-Type', 'video/'],
        ],
        Fields: {
          'Content-Type': 'video/*',
        },
      });

      return { url, fields };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message || (error as any).code
          : 'Unknown error';
      this.logURLGenerationFailed(uuid, errorMessage);
      throw new Error(`Failed to generate pre-signed URL: ${errorMessage}`);
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
        `\tUUID: ${uuid}.\n` +
        `\tBucket: ${this.bucketName}.\n` +
        `\tTimestamp: ${new Date().toISOString()}`
    );
  }

  private logURLGenerationFailed(uuid: string, errorMessage: string) {
    console.error(
      '[ERROR] - Failed Generating S3 Pre-Signed URL.\n' +
        `\tUUID: ${uuid}.\n` +
        `\tBucket: ${this.bucketName}.\n` +
        `\tError: ${errorMessage}.\n` +
        `\tTimestamp: ${new Date().toISOString()}`
    );
  }
}
