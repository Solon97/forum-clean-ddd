import { DomainEvent } from '@/shared/events/domain-event';
import { Answer } from '../answer';

export class AnswerCreatedEvent implements DomainEvent {
  public readonly occurredAt: Date;
  public readonly answer: Answer;
  constructor(answer: Answer) {
    this.occurredAt = new Date();
    this.answer = answer;
  }

  getAggregateId() {
    return this.answer.id;
  }
}
