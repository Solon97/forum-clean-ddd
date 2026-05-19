import { BaseEntity, Timestamps } from '@/shared/entities/base-entity';
import { UniqueEntityId } from '@/shared/entities/value-objects/unique-entity-id/index';
import { Optional } from '@/types/optional';
import { AnswerAttachmentList } from './answer-attachment-list';

export interface AnswerProps {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  content: string;
  attachments: AnswerAttachmentList;
}

export class Answer extends BaseEntity<AnswerProps & Timestamps> {
  constructor(
    props: Optional<AnswerProps, 'attachments'> & Partial<Timestamps>,
    id?: UniqueEntityId,
  ) {
    const propsWithTimestamps = BaseEntity.setPropsTimestamps(props);

    super(
      {
        ...propsWithTimestamps,
        attachments: props.attachments || new AnswerAttachmentList(),
      },
      id,
    );
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

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }
}
