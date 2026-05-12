import { BaseEntity } from "./base-entity.js";

export interface AnswerProps {
  content: string;
  questionId: string;
  authorId: string;
}

export class Answer extends BaseEntity<AnswerProps> {
  get content() {
    return this.props.content;
  }

  get questionId() {
    return this.props.questionId;
  }

  get authorId() {
    return this.props.authorId;
  }
}
