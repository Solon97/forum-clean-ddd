import { Mock } from 'vitest';
import { makeAnswer } from '@test/factories/make-answer';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { AnswerRepository } from '../repositories/answer-repository';
import { DeleteAnswerUseCase } from './delete-answer';

let inMemoryAnswerRepository: AnswerRepository;
let sut: DeleteAnswerUseCase;
let sutRepositorySpy: Mock<typeof inMemoryAnswerRepository.delete>;

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository);
    sutRepositorySpy = vi.spyOn(inMemoryAnswerRepository, 'delete');
  });

  it('should be able to delete a answer', async () => {
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    await sut.execute({
      answerId: exampleAnswer.id.toString(),
      authorId: exampleAnswer.authorId.toString(),
    });
    assertRepositorySpyCalled(sutRepositorySpy, exampleAnswer);
    const deletedAnswer = await inMemoryAnswerRepository.findById(
      exampleAnswer.id.toString(),
    );
    expect(deletedAnswer).toBeNull();
  });

  it('should not be able to delete a non existing answer', async () => {
    await expect(() =>
      sut.execute({
        answerId: 'non-existing-answer-id',
        authorId: 'any-author-id',
      }),
    ).rejects.toThrow('Answer not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to delete a answer from another author', async () => {
    const exampleAnswer = makeAnswer();
    await inMemoryAnswerRepository.create(exampleAnswer);
    await expect(() =>
      sut.execute({
        answerId: exampleAnswer.id.toString(),
        authorId: 'other-author-id',
      }),
    ).rejects.toThrow('Answer not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
