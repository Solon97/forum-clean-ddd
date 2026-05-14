import { Question, QuestionProps } from '@/domain/forum/entities/question';
import { Timestamps } from '@/shared/domain/entities/base-entity';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';

export function makeQuestion(
  override: Partial<QuestionProps & Timestamps> = {},
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
