import { CreatePreSignedURL } from '../ports/CreatePreSignedURL';
import { v4 as uuid } from 'uuid';

const DEFAULT_EXPIRATION_TIME = 60 * 10;

function getInitialStatusJson(id: string): { [key: string]: string } {
  return {
    id: id,
    status: 'URL_GENERATED',
  };
}

const createPresignedURLUseCase: CreatePreSignedURL = async function (
  signingClient
) {
  // @TODO: Recursos deveriam ser prefixados com o ID do usuário
  const videoUUID = uuid();
  const resourceName = `${videoUUID}/raw_video.mp4`;

  const uploadParams = await signingClient.getVideoSignedURL(
    resourceName,
    DEFAULT_EXPIRATION_TIME
  );

  await signingClient.createJSONResource(
    `${videoUUID}/status.json`,
    getInitialStatusJson(videoUUID)
  );

  return {
    uuid: videoUUID,
    uploadParams: uploadParams,
  };
};

export default createPresignedURLUseCase;
