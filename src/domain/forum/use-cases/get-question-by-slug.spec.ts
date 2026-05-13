import { Mock } from 'vitest';
import { makeQuestion } from '../../../../test/factories/make-question';
import { InMemoryQuestionRepository } from '../../../../test/repositories/in-memory-question-repository';
import { QuestionRepository } from '../repositories/question-repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { assertRepositorySpyCalled } from '../../../../test/helpers/spy-helpers';

let inMemoryQuestionRepository: QuestionRepository;
let sut: GetQuestionBySlugUseCase;
let sutRepositorySpy: Mock<typeof inMemoryQuestionRepository.findBySlug>;

describe('Get Question by Slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository);
    sutRepositorySpy = vi.spyOn(inMemoryQuestionRepository, 'findBySlug');
  });

  it('should be able to get a question by slug', async () => {
    const exampleQuestion = makeQuestion();
    await inMemoryQuestionRepository.create(exampleQuestion);

    const { question } = await sut.execute({
      slug: exampleQuestion.slug.value,
    });

    assertRepositorySpyCalled(sutRepositorySpy, exampleQuestion.slug.value);
    expect(question).toEqual(exampleQuestion);
  });

  it('should not be able to get a question with an invalid slug', async () => {
    await expect(() =>
      sut.execute({
        slug: 'invalid-slug',
      }),
    ).rejects.toThrow('Question not found');
    assertRepositorySpyCalled(sutRepositorySpy, 'invalid-slug');
  });
});
