import { ListProcessingStatus } from '../ports/ListProcessingStatus';
import { StatusFile } from '../ports/StatusFile';

const listProcessingStatusUseCase: ListProcessingStatus = async function (
  storageClient
) {
  // @TODO: Extrair o ID do usuário e fornecer como filtro

  const statusFiles = await storageClient.getVideoStatuses();
  const statusContents = await Promise.all(
    statusFiles.map(async (key: any) => {
      const statusContent = await storageClient.retrieveVideoStatusContent(key);
      return JSON.parse(statusContent);
    })
  );

  const statusContentById = statusContents.reduce(
    (reducedStatus: Record<string, string>, statusContent: StatusFile) => {
      reducedStatus[statusContent.id] = statusContent.status;
      return reducedStatus;
    },
    {} as Record<string, string>
  );

  return statusContentById;
};

export default listProcessingStatusUseCase;
