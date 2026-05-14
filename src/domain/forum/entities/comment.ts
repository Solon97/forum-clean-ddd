import { BaseEntityWithTimestamps } from '@/shared/domain/entities/base-entity';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id';

export interface CommentProps {
  content: string;
  authorId: UniqueEntityId;
}

abstract class Comment<
  T extends CommentProps,
> extends BaseEntityWithTimestamps<T> {
  get authorId() {
    return this.props.authorId;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }
}

export class QuestionComment extends Comment<
  { questionId: UniqueEntityId } & CommentProps
> {
  get questionId() {
    return this.props.questionId;
  }
}

export class AnswerComment extends Comment<
  { answerId: UniqueEntityId } & CommentProps
> {
  get answerId() {
    return this.props.answerId;
  }
}
