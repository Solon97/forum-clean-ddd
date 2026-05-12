import { BaseEntity } from "./base-entity";

export interface InstructorProps {
  name: string;
}

export class Instructor extends BaseEntity<InstructorProps> {
  get name() {
    return this.props.name;
  }
}
