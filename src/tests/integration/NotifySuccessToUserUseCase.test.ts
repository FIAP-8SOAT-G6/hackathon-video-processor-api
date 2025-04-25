import { expect } from 'chai';
import sinon from 'sinon';
import { notifySuccessToUserUseCase } from '../../core/use-cases/NotifySuccessToUserUseCase';
import { NotifyService } from '../../core/ports/NotifyService';
import { NotifyUserInput } from '../../core/ports/NotifyUserInput';

describe('Notify Success To User Use Case', () => {
  it('should call sendEmail with the correct parameters', async () => {
    const notifyUserInput: NotifyUserInput = {
      email: 'user@example.com',
      videoName: 'My Awesome Video',
    };

    const sendEmailStub = sinon.stub().resolves();
    const mockNotifyService: NotifyService = {
      sendEmail: sendEmailStub,
    };

    await notifySuccessToUserUseCase(notifyUserInput, mockNotifyService);

    expect(sendEmailStub.calledOnce).to.be.true;
    expect(
      sendEmailStub.calledWith({
        to: 'user@example.com',
        subject: 'Seu vídeo está pronto!',
        text: 'O vídeo "My Awesome Video" foi processado com sucesso e está pronto para visualização.',
      })
    ).to.be.true;
  });
});
