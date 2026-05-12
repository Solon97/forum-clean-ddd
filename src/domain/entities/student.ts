import { BaseEntity } from './base-entity.js'

export interface StudentProps {
  name: string
}

export class Student extends BaseEntity<StudentProps> {
  get name() {
    return this.props.name
  }
}
