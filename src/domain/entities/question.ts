import { BaseEntity } from './base-entity.js'
import { Slug } from './value-objects/slug/index.js'
import { UniqueEntityId } from './value-objects/unique-entity-id/index.js'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId
  title: string
  content: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date
}

export class Question extends BaseEntity<QuestionProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get slug() {
    return this.props.slug
  }
}
