type CreatePreSignedURLResponse = {
  uuid: string;
  uploadParams: {
    url: string;
    fields: Record<string, string>;
  };
};

interface StorageClient {
  getVideoSignedURL: (
    resourceName: string,
    expirationTime: number
  ) => Promise<{
    url: string;
    fields: Record<string, string>;
  }>;

  createJSONResource: (resourceName: string, resource: any) => Promise<void>;
}

export interface CreatePreSignedURL {
  (storageClient: StorageClient): Promise<CreatePreSignedURLResponse>;
}
