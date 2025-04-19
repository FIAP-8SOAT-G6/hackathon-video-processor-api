import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const BUCKET_NAME = process.env.BUCKET_NAME!;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION!;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT!;

const s3 = new S3Client({
  endpoint: AWS_ENDPOINT,
  region: AWS_DEFAULT_REGION,
  forcePathStyle: true,
});

export const clearS3Bucket = async () => {
  const list = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }));

  for (const obj of list.Contents || []) {
    await s3.send(
      new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: obj.Key! })
    );
  }
};
