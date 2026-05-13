import { Mock } from 'vitest';
import { makeQuestion } from '../../../../test/factories/make-question';
import {
  assertRepositorySpyCalled,
  assertRepositorySpyNotCalled,
} from '../../../../test/helpers/spy-helpers';
import { InMemoryQuestionRepository } from '../../../../test/repositories/in-memory-question-repository';
import { QuestionRepository } from '../repositories/question-repository';
import { DeleteQuestionUseCase } from './delete-question';

let inMemoryQuestionRepository: QuestionRepository;
let sut: DeleteQuestionUseCase;
let sutRepositorySpy: Mock<typeof inMemoryQuestionRepository.delete>;

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository);
    sutRepositorySpy = vi.spyOn(inMemoryQuestionRepository, 'delete');
  });

  it('should be able to delete a question', async () => {
    const exampleQuestion = makeQuestion();
    await inMemoryQuestionRepository.create(exampleQuestion);
    await sut.execute({
      questionId: exampleQuestion.id.toString(),
      authorId: exampleQuestion.authorId.toString(),
    });
    assertRepositorySpyCalled(sutRepositorySpy, exampleQuestion);
    const deletedQuestion = await inMemoryQuestionRepository.findById(
      exampleQuestion.id.toString(),
    );
    expect(deletedQuestion).toBeNull();
  });

  it('should not be able to delete a non existing question', async () => {
    await expect(() =>
      sut.execute({ questionId: 'non-existing-question-id' }),
    ).rejects.toThrow('Question not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });

  it('should not be able to delete a question from another author', async () => {
    const exampleQuestion = makeQuestion();
    await inMemoryQuestionRepository.create(exampleQuestion);
    await expect(() =>
      sut.execute({
        questionId: exampleQuestion.id.toString(),
        authorId: 'other-author-id',
      }),
    ).rejects.toThrow('Question not found');
    assertRepositorySpyNotCalled(sutRepositorySpy);
  });
});
