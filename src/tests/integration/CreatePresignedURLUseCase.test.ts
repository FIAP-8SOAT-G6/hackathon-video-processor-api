import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import createPresignedURLUseCase from '../../core/use-cases/CreatePresignedURLUseCase';
import { S3SigningClient } from '../../core/adapters/S3SigningClient';

chai.use(chaiAsPromised);
const expect = chai.expect;

const BUCKET_NAME = process.env.BUCKET_NAME!;
const AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION!;
const AWS_ENDPOINT = process.env.AWS_ENDPOINT!;

describe('CreatePresignedURLUseCase', () => {
  it('should return uuid and url', async () => {
    const useCaseResponse = await createPresignedURLUseCase(
      new S3SigningClient(BUCKET_NAME, AWS_DEFAULT_REGION, AWS_ENDPOINT)
    );

    expect(useCaseResponse).to.be.an('object');
    expect(useCaseResponse).to.have.property('uuid');
    expect(useCaseResponse.uuid).to.be.a('string');
    expect(useCaseResponse.uploadParams).to.be.a('object');
    expect(useCaseResponse.uploadParams).to.have.property('url');
    expect(useCaseResponse.uploadParams).to.have.property('fields');
    expect(useCaseResponse.uploadParams.url).to.be.a('string');
    expect(useCaseResponse.uploadParams.fields).to.be.an('object');
  });

  it('should throw an error if there is a problem with S3 connection', async () => {
    const invalidClient = new S3SigningClient(
      'INVALID_BUCKET',
      'INVALID_REGION',
      'http://localhost:9999'
    );
    await expect(
      createPresignedURLUseCase(invalidClient)
    ).to.be.eventually.rejectedWith(/Failed to generate pre-signed URL: .+/);
  });
});
