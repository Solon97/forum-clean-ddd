import { InMemoryAnswerRepository } from '../../../../test/repositories/in-memory-answer-repository';
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id';
import { AnswerQuestionUseCase } from './answer-question';
import type { AnswerRepository } from '@/domain/forum/repositories/answer-repository';

let inMemoryAnswerRepository: AnswerRepository;
let answerQuestionUseCase: AnswerQuestionUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    answerQuestionUseCase = new AnswerQuestionUseCase(inMemoryAnswerRepository);
  });

  test('should be able to create an answer', async () => {
    const createSpy = vi.spyOn(inMemoryAnswerRepository, 'create');
    const questionId = new UniqueEntityId().toString();
    const instructorId = new UniqueEntityId().toString();
    const input = {
      questionId,
      instructorId,
      content: 'This is an answer to the question.',
    };

    const output = await answerQuestionUseCase.execute(input);

    expect(createSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(output).toBeTruthy();
    expect(output.answer.id).toBeTruthy();
    expect(output.answer.content).toBe(input.content);
    expect(output.answer.questionId.toString()).toBe(input.questionId);
    expect(output.answer.authorId.toString()).toBe(input.instructorId);
  });
});
