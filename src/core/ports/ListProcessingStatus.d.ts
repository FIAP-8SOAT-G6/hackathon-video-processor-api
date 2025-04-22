type ListProcessingStatusResponse = Record<string, string>;

export interface ListProcessingStatus {
  (storageClient: StorageClient): Promise<ListProcessingStatusResponse>;
}
