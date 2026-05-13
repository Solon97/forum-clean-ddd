import { InMemoryQuestionRepository } from '../../../../test/repositories/in-memory-question-repository';
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id';
import { QuestionRepository } from '../repositories/question-repository';
import { CreateQuestionUseCase } from './create-question';

let inMemoryQuestionRepository: QuestionRepository;
let createQuestionUseCase: CreateQuestionUseCase;
describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionRepository();
    createQuestionUseCase = new CreateQuestionUseCase(
      inMemoryQuestionRepository,
    );
  });

  it('should create a question', async () => {
    const createSpy = vi.spyOn(inMemoryQuestionRepository, 'create');
    const authorId = new UniqueEntityId();
    const input = {
      authorId: authorId.toString(),
      title: 'How to implement DDD in a forum application?',
      content:
        'I want to learn how to implement DDD in a forum application. Any tips?',
    };

    const output = await createQuestionUseCase.execute(input);

    expect(createSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(output.question).toBeTruthy();
    expect(output.question.id).toBeTruthy();
    expect(output.question.authorId.toString()).toBe(input.authorId);
    expect(output.question.title).toBe(input.title);
    expect(output.question.content).toBe(input.content);
  });
});
