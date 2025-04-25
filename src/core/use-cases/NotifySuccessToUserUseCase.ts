import { NotifyService } from '../ports/NotifyService';
import { NotifyUserInput } from '../ports/NotifyUserInput';

export const notifySuccessToUserUseCase = async (
  notifyUserInput: NotifyUserInput,
  notifyService: NotifyService
) => {
  const subject = 'Seu vídeo está pronto!';
  const text = `O vídeo "${notifyUserInput.videoName}" foi processado com sucesso e está pronto para visualização.`;

  await notifyService.sendEmail({ to: notifyUserInput.email, subject, text });
};
