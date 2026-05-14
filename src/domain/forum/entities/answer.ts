import { BaseEntityWithTimestamps } from '@/shared/domain/entities/base-entity';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index';

export interface AnswerProps {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  content: string;
}

export class Answer extends BaseEntityWithTimestamps<AnswerProps> {
  get content() {
    return this.props.content;
  }

  get questionId() {
    return this.props.questionId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }
}
