import { notifyErrorToUserUseCase } from '../core/use-cases/NotifyErrorToUserUseCase';
import { SNSEvent } from 'aws-lambda';
import EmailService from '../infrastructure/EmailService';

export const handler = async (event: SNSEvent): Promise<void> => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message);
    const NotifyService = EmailService;

    await notifyErrorToUserUseCase(
      {
        email: message.email,
        videoName: message.videoName,
      },
      NotifyService
    );
  }
};
