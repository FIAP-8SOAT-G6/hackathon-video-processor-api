import { APIGatewayProxyHandler } from "aws-lambda";
import { S3SigningClient } from "./core/adapters/S3SigningClient";
import { createPresignedURLUseCase } from "./core/use-cases/CreatePresignedURLUseCase";

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const s3SigningClient = new S3SigningClient();
    const { uuid, uploadParams } = await createPresignedURLUseCase(s3SigningClient);

    return {
      statusCode: 200,
      body: JSON.stringify({ uuid, uploadParams }),
    };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
