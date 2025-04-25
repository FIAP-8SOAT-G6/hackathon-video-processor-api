import { expect } from 'chai';
import sinon from 'sinon';
import { notifyErrorToUserUseCase } from '../../core/use-cases/NotifyErrorToUserUseCase';
import { NotifyService } from '../../core/ports/NotifyService';
import { NotifyUserInput } from '../../core/ports/NotifyUserInput';

describe('Notify Error To User Use Case', () => {
  it('should call sendEmail with error in process', async () => {
    const notifyUserInput: NotifyUserInput = {
      email: 'user@example.com',
      videoName: 'My Awesome Video',
    };

    const sendEmailStub = sinon.stub().resolves();
    const mockNotifyService: NotifyService = {
      sendEmail: sendEmailStub,
    };

    await notifyErrorToUserUseCase(notifyUserInput, mockNotifyService);

    expect(sendEmailStub.calledOnce).to.be.true;
    expect(
      sendEmailStub.calledWith({
        to: 'user@example.com',
        subject: 'Houve um problema ao processar seu vídeo!',
        text: 'O vídeo "My Awesome Video" não foi processado corretamente. Solicite ajuda.',
      })
    ).to.be.true;
  });
});
