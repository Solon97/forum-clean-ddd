import { PaginationParams } from '@/shared/domain/repositories/pagination-params';
import { assertRepositorySpyCalled } from '@test/helpers/spy-helpers';
import { InMemoryAnswerRepository } from '@test/repositories/in-memory-answer-repository';
import { Mock } from 'vitest';
import { AnswerRepository } from '../repositories/answer-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';

let inMemoryAnswerRepository: AnswerRepository;
let sut: FetchQuestionAnswersUseCase;
let sutRepositorySpy: Mock<
  typeof inMemoryAnswerRepository.findManyByQuestionId
>;

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
    sutRepositorySpy = vi.spyOn(
      inMemoryAnswerRepository,
      'findManyByQuestionId',
    );
  });

  it('should be able to fetch question answers', async () => {
    const paginationParams: PaginationParams = { page: 1 };
    await sut.execute({
      paginationParams,
      questionId: 'question-id',
    });
    assertRepositorySpyCalled(sutRepositorySpy, [
      paginationParams,
      'question-id',
    ]);
  });
});
