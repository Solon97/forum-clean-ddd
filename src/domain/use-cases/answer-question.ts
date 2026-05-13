import { Answer } from '../entities/answer.js'
import { UniqueEntityId } from '../entities/value-objects/unique-entity-id/index.js'
import type { AnswerRepository } from '../repositories/answer-repository.js'

interface AnswerQuestionUseCaseInput {
  questionId: string
  instructorId: string
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({ questionId, instructorId, content }: AnswerQuestionUseCaseInput) {
    const answer = new Answer({
      content,
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(instructorId),
    })
    await this.answerRepository.create(answer)
    return answer
  }
}
