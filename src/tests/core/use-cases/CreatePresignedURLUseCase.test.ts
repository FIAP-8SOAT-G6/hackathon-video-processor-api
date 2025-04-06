import { expect } from "chai";
import { SigningClient } from "../../../core/ports/CreatePreSignedURL";
import { createPresignedURLUseCase } from "../../../core/use-cases/CreatePresignedURLUseCase";

const MockSigningClient: SigningClient = {
  getSignedURL(_uuid, _expirationTime) {
    return Promise.resolve({
      url: "https://example.com/some-presigned-url",
      fields: {
        "Content-Type": "video/*",
      },
    });
  },
};

describe("CreatePresignedURLUseCase", () => {
  it("should return uuid and url", async () => {
    const useCaseResponse = await createPresignedURLUseCase(MockSigningClient);

    expect(useCaseResponse).to.be.an("object");
    expect(useCaseResponse).to.have.property("uuid");
    expect(useCaseResponse.uuid).to.be.a("string");
    expect(useCaseResponse.uploadParams).to.be.a("object");
    expect(useCaseResponse.uploadParams).to.have.property("url");
    expect(useCaseResponse.uploadParams).to.have.property("fields");
    expect(useCaseResponse.uploadParams.url).to.be.a("string");
    expect(useCaseResponse.uploadParams.fields).to.be.an("object");
  });
});
