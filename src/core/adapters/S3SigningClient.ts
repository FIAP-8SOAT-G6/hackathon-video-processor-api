import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { SigningClient } from "../ports/CreatePreSignedURL";

const BUCKET_NAME = process.env.BUCKET_NAME;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION;
const MAXIMUM_FILE_SIZE = 209715200; // 200 MB

export class S3SigningClient implements SigningClient {
  async getSignedURL(
    uuid: string,
    expirationTime: number
  ): Promise<{ url: string; fields: Record<string, string> }> {
    try {
      this.logURLGeneration(uuid);
      const s3Client = new S3Client({ region: AWS_DEFAULT_REGION });

      const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: BUCKET_NAME!,
        Key: uuid,
        Expires: expirationTime,
        Conditions: [
          ["content-length-range", 0, MAXIMUM_FILE_SIZE],
          ["starts-with", "$Content-Type", "video/"],
        ],
        Fields: {
          "Content-Type": "video/*",
        },
      });

      return { url, fields };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logURLGenerationFailed(uuid, errorMessage);
      throw new Error(`Failed to generate pre-signed URL: ${errorMessage}`);
    }
  }

  private logURLGeneration(uuid: string) {
    console.info(
      "[INFO] - Started Generating S3 Pre-Signed URL.\n" +
        `\tUUID: ${uuid}.\n` +
        `\tBucket: ${BUCKET_NAME}.\n` +
        `\tTimestamp: ${new Date().toISOString()}`
    );
  }

  private logURLGenerationFailed(uuid: string, errorMessage: string) {
    console.error(
      "[ERROR] - Failed Generating S3 Pre-Signed URL.\n" +
        `\tUUID: ${uuid}.\n` +
        `\tBucket: ${BUCKET_NAME}.\n` +
        `\tError: ${errorMessage}.\n` +
        `\tTimestamp: ${new Date().toISOString()}`
    );
  }
}
