import { PaginationParams } from '@/shared/domain/repositories/pagination-params';
import { assertRepositorySpyCalled } from '@test/helpers/spy-helpers';
import { InMemoryQuestionCommentRepository } from '@test/repositories/in-memory-question-comment-repository';
import { Mock } from 'vitest';
import { QuestionCommentRepository } from '../repositories/question-comment-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

let inMemoryQuestionCommentRepository: QuestionCommentRepository;
let sut: FetchQuestionCommentsUseCase;
let sutRepositorySpy: Mock<
  typeof inMemoryQuestionCommentRepository.findManyByQuestionId
>;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
    sutRepositorySpy = vi.spyOn(
      inMemoryQuestionCommentRepository,
      'findManyByQuestionId',
    );
  });

  it('should be able to fetch question comments', async () => {
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
