import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION;
const bucketName = process.env.BUCKET_NAME;
const expirationTime = Number(process.env.EXPIRATION_TIME) || 600; // 10 minutes

function createPresignedUrlWithClient(key: string) {
  const client = new S3Client({ region: region });
  const putCommand = new PutObjectCommand({ Bucket: bucketName, Key: key });
  return getSignedUrl(client, putCommand, { expiresIn: expirationTime });
}
