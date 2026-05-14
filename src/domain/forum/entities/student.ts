import { BaseEntity } from '@/shared/domain/entities/base-entity';

export interface StudentProps {
  name: string;
}

export class Student extends BaseEntity<StudentProps> {
  get name() {
    return this.props.name;
  }
}
