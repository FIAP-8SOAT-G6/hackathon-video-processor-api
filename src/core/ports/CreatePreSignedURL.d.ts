type CreatePreSignedURLResponse = {
  uuid: string;
  uploadParams: {
    url: string;
    fields: Record<string, string>;
  };
};

export interface CreatePreSignedURL {
  (storageClient: StorageClient): Promise<CreatePreSignedURLResponse>;
}
