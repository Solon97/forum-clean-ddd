import { BaseEntity } from './base-entity.js'
import { UniqueEntityId } from './value-objects/unique-entity-id/index.js'

export interface AnswerProps {
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends BaseEntity<AnswerProps> {
  get content() {
    return this.props.content
  }
}
