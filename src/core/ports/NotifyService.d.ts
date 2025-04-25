export interface NotifyService {
  sendEmail: (params: {
    to: string;
    subject: string;
    text: string;
  }) => Promise<void>;
}
