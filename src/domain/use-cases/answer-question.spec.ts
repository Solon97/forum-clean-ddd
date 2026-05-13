import { expect, test, vitest } from 'vitest';
import { AnswerQuestionUseCase } from './answer-question';
import type { AnswerRepository } from '@/domain/repositories/answer-repository';

const mockAnswerRepository: AnswerRepository = {
  create: vitest.fn().mockResolvedValue(undefined),
};

test('create an answer', async () => {
  // Given
  const useCase = new AnswerQuestionUseCase(mockAnswerRepository);
  const input = {
    questionId: crypto.randomUUID(),
    instructorId: crypto.randomUUID(),
    content: 'This is an answer to the question.',
  };

  // When
  const answer = await useCase.execute(input);

  // Then
  expect(answer).toBeDefined();
  expect(answer.content).toBe(input.content);
});
