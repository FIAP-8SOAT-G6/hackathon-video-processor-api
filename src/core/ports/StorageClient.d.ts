export interface StorageClient {
  getVideoStatuses: () => Promise<string[]>;
  retrieveVideoStatusContent: (key: string) => Promise<string>;
  
  getVideoSignedURL: (
    resourceName: string,
    expirationTime: number
  ) => Promise<{
    url: string;
    fields: Record<string, string>;
  }>;
  createJSONResource: (resourceName: string, resource: any) => Promise<void>;
}
