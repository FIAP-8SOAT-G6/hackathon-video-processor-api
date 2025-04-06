import { CreatePreSignedURL } from '../ports/CreatePreSignedURL';
import { v4 as uuid } from 'uuid';

const DEFAULT_EXPIRATION_TIME = 60 * 10;

export const createPresignedURLUseCase: CreatePreSignedURL = async (
  signingClient
) => {
  const UUID = uuid();
  const uploadParams = await signingClient.getSignedURL(
    UUID,
    DEFAULT_EXPIRATION_TIME
  );

  return {
    uuid: UUID,
    uploadParams: uploadParams,
  };
};
