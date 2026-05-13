import { UniqueEntityId } from './value-objects/unique-entity-id'

type Timestamps = {
  createdAt: Date
  updatedAt?: Date
}

export class BaseEntity<TProps extends object> {
  readonly id: UniqueEntityId
  protected props: TProps

  constructor(props: TProps, id?: UniqueEntityId) {
    this.id = id ?? new UniqueEntityId()
    this.props = props
  }
}

export class BaseEntityWithTimestamps<TProps> extends BaseEntity<TProps & Timestamps> {
  constructor(props: TProps & Partial<Timestamps>, id?: UniqueEntityId) {
    const now = new Date()
    const propsWithTimestamps: TProps & Timestamps = {
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    }
    super(propsWithTimestamps, id)
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
