import {
  BaseEntityWithTimestamps,
  Timestamps,
} from '@/shared/domain/entities/base-entity';
import { UniqueEntityId } from '@/shared/domain/entities/value-objects/unique-entity-id/index.js';
import { Optional } from '@/types/optional.js';
import { Slug } from './value-objects/slug/index.js';

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | undefined;
  title: string;
  content: string;
  slug: Slug;
}

export class Question extends BaseEntityWithTimestamps<QuestionProps> {
  constructor(
    props: Optional<QuestionProps, 'slug'> & Partial<Timestamps>,
    id?: UniqueEntityId,
  ) {
    const slug = props.slug || Slug.createFromText(props.title);
    super({ ...props, slug }, id);
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
