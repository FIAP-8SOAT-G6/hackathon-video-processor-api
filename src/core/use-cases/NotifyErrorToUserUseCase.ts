import { NotifyService } from '../ports/NotifyService';
import { NotifyUserInput } from '../ports/NotifyUserInput';

export const notifyErrorToUserUseCase = async (
  notifyUserInput: NotifyUserInput,
  notifyService: NotifyService
) => {
  const subject = 'Houve um problema ao processar seu vídeo!';
  const text = `O vídeo "${notifyUserInput.videoName}" não foi processado corretamente. Solicite ajuda.`;

  await notifyService.sendEmail({ to: notifyUserInput.email, subject, text });
};
