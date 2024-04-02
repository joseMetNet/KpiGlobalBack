export interface UserDto {
  id: number;
  profileId: number;
}

export interface IUserAnswer {
  userId: number,
  questionId: number,
  answerOptionId: number,
  openAnswerText: string
}
