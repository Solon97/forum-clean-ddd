import { UniqueEntityId } from './value-objects/unique-entity-id'

export class BaseEntity<T> {
  readonly id: UniqueEntityId
  readonly props: T

  constructor(props: T, id?: string) {
    this.id = new UniqueEntityId(id)
    this.props = props
  }
}
