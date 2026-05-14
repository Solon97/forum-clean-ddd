import { Mock } from 'vitest';
import { InMemoryQuestionRepository } from '@test/repositories/in-memory-question-repository';
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id';
import { QuestionRepository } from '../repositories/question-repository';
import { CreateQuestionUseCase } from './create-question';
import { assertRepositorySpyCalled } from '@test/helpers/spy-helpers';

let inMemoryQuestionRepository: QuestionRepository;
let sut: CreateQuestionUseCase;
let sutRepositorySpy: Mock<typeof inMemoryQuestionRepository.create>;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository);
    sutRepositorySpy = vi.spyOn(inMemoryQuestionRepository, 'create');
  });

  it('should create a question', async () => {
    const input = {
      authorId: new UniqueEntityId().toString(),
      title: 'How to implement DDD in a forum application?',
      content:
        'I want to learn how to implement DDD in a forum application. Any tips?',
    };

    const output = await sut.execute(input);

    assertRepositorySpyCalled(sutRepositorySpy);
    expect(output.question).toBeTruthy();
    expect(output.question.id).toBeTruthy();
    expect(output.question.authorId.toString()).toBe(input.authorId);
    expect(output.question.title).toBe(input.title);
    expect(output.question.content).toBe(input.content);
    expect(output.question.createdAt).toBeTruthy();
    expect(output.question.updatedAt).toBeTruthy();
  });
});
