import { Mock } from 'vitest';
import { assertRepositorySpyCalled } from '../../../../test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '../../../../test/repositories/in-memory-answer-repository';
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id';
import { AnswerQuestionUseCase } from './answer-question';
import type { AnswerRepository } from '@/domain/forum/repositories/answer-repository';

let inMemoryAnswerRepository: AnswerRepository;
let answerQuestionUseCase: AnswerQuestionUseCase;
let sutRepositorySpy: Mock<typeof inMemoryAnswerRepository.create>;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    answerQuestionUseCase = new AnswerQuestionUseCase(inMemoryAnswerRepository);
    sutRepositorySpy = vi.spyOn(inMemoryAnswerRepository, 'create');
  });

  test('should be able to create an answer', async () => {
    const questionId = new UniqueEntityId().toString();
    const instructorId = new UniqueEntityId().toString();
    const input = {
      questionId,
      instructorId,
      content: 'This is an answer to the question.',
    };

    const output = await answerQuestionUseCase.execute(input);

    assertRepositorySpyCalled(sutRepositorySpy);
    expect(output).toBeTruthy();
    expect(output.answer.id).toBeTruthy();
    expect(output.answer.content).toBe(input.content);
    expect(output.answer.questionId.toString()).toBe(input.questionId);
    expect(output.answer.authorId.toString()).toBe(input.instructorId);
  });
});
