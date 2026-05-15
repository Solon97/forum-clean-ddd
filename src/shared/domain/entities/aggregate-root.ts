import { BaseEntity } from './base-entity';

export abstract class AggregateRoot<
  TProps extends object,
> extends BaseEntity<TProps> {}
