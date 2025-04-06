type CreatePreSignedURLResponse = {
  uuid: string;
  uploadParams: {
    url: string;
    fields: Record<string, string>;
  };
};

interface SigningClient {
  getSignedURL: (
    uuid: string,
    expirationTime: number
  ) => Promise<{
    url: string;
    fields: Record<string, string>;
  }>;
}

export interface CreatePreSignedURL {
  (signingClient: SigningClient): Promise<CreatePreSignedURLResponse>;
}
