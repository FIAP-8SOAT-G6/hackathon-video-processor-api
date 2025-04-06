import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3StorageClient } from './core/adapters/S3Client';
import createPresignedURLUseCase from './core/use-cases/CreatePresignedURLUseCase';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME!;
    const region = process.env.AWS_DEFAULT_REGION!;
    const endpoint = process.env.AWS_ENDPOINT!;

    const s3SigningClient = new S3StorageClient(bucketName, region, endpoint);
    const { uuid, uploadParams } = await createPresignedURLUseCase(
      s3SigningClient
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ uuid, uploadParams }),
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
