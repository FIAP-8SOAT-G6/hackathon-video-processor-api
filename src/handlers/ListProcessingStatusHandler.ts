import { APIGatewayProxyHandler } from 'aws-lambda';
import { S3StorageClient } from '../core/adapters/S3Client';
import listProcessingStatusUseCase from '../core/use-cases/ListProcessingStatusUseCase';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME!;
    const region = process.env.AWS_DEFAULT_REGION!;
    const endpoint = process.env.AWS_ENDPOINT!;

    const s3StorageClient = new S3StorageClient(bucketName, region, endpoint);
    const statuses = await listProcessingStatusUseCase(s3StorageClient);

    return {
      statusCode: 200,
      body: JSON.stringify({ statuses }),
    };
  } catch (error) {
    console.error('Error getting video processing statuses:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
