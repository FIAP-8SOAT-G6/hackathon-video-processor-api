import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import createPresignedURLUseCase from '../../core/use-cases/CreatePresignedURLUseCase';
import { S3StorageClient } from '../../core/adapters/S3Client';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { clearS3Bucket } from '../utils/ClearS3';
import listProcessingStatusUseCase from '../../core/use-cases/ListProcessingStatusUseCase';

chai.use(chaiAsPromised);
const expect = chai.expect;

const BUCKET_NAME = process.env.BUCKET_NAME!;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION!;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT!;

describe('ListProcessingStatusUseCase', () => {
  beforeEach(async () => {
    await clearS3Bucket();
  });

  it.only('should return consolidated status from S3', async () => {
    const s3StorageClient = new S3StorageClient(
      BUCKET_NAME,
      AWS_DEFAULT_REGION,
      AWS_ENDPOINT
    );
    await createPresignedURLUseCase(s3StorageClient);
    const useCaseResponse = await listProcessingStatusUseCase(s3StorageClient);
    expect(useCaseResponse).to.be.an('object');
    expect(Object.keys(useCaseResponse)).to.have.lengthOf(1);
  });

  it('should throw an error if there is a problem with S3 connection', async () => {
    const invalidClient = new S3StorageClient(
      'INVALID_BUCKET',
      'INVALID_REGION',
      'http://localhost:9999'
    );
    await expect(listProcessingStatusUseCase(invalidClient)).to.be.eventually
      .rejected;
  });
});
