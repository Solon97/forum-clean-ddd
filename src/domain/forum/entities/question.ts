import { BaseEntity, Timestamps } from '@/shared/domain/entities/base-entity';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index.js';
import { Optional } from '@/types/optional.js';
import { Slug } from './value-objects/slug/index.js';
import { AggregateRoot } from '@/shared/domain/entities/aggregate-root.js';

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | undefined;
  title: string;
  content: string;
  slug: Slug;
}

export class Question extends AggregateRoot<QuestionProps & Timestamps> {
  constructor(
    props: Optional<QuestionProps, 'slug'> & Partial<Timestamps>,
    id?: UniqueEntityId,
  ) {
    const slug = props.slug || Slug.createFromText(props.title);
    const propsWithTimestamps = BaseEntity.setPropsTimestamps({
      ...props,
      slug,
    });
    super(propsWithTimestamps, id);
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
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

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.createFromText(title);
    this.touch();
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    this.props.bestAnswerId = bestAnswerId;
    this.touch();
  }
}
