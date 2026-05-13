import { Question, QuestionProps } from '@/domain/forum/entities/question';
import { UniqueEntityId } from '@/domain/forum/entities/value-objects/unique-entity-id';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
): Question {
  const question: Question = new Question(
    {
      title: 'Example Question',
      content: 'This is an example question.',
      authorId: new UniqueEntityId(),
      ...override,
    },
    id,
  );
  return question;
}
