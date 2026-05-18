import { BaseEntity, Timestamps } from '@/shared/domain/entities/base-entity';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index';
import { AnswerAttachment } from './answer-attachment';
import { Optional } from '@/types/optional';

export interface AnswerProps {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  content: string;
  attachments: AnswerAttachment[];
}

export class Answer extends BaseEntity<AnswerProps & Timestamps> {
  constructor(
    props: Optional<AnswerProps, 'attachments'> & Partial<Timestamps>,
    id?: UniqueEntityId,
  ) {
    const propsWithTimestamps = BaseEntity.setPropsTimestamps(props);

    super({ ...propsWithTimestamps, attachments: props.attachments || [] }, id);
  }

  get content() {
    return this.props.content;
  }

  get questionId() {
    return this.props.questionId;
  }

  get authorId() {
    return this.props.authorId;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  get attachments() {
    return this.props.attachments;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  set attachments(attachments: AnswerAttachment[]) {
    this.props.attachments = attachments;
    this.touch();
  }
}
