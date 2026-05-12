import { BaseEntity } from "./base-entity.js";
import { Slug } from "./value-objects/slug/index.js";

export interface QuestionProps {
  title: string
  content: string
  authorId: string
  slug: Slug
}
 
export class Question extends BaseEntity<QuestionProps> {
  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get authorId() {
    return this.props.authorId;
  }

  get slug() {
    return this.props.slug;
  }
}
