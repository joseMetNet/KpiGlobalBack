export interface UserDto {
  id: number;
  profileId: number;
  isRegistrationCompleted?: number;
}

export interface IUserAnswer {
  userId: number;
  questionId: number;
  answerOptionId: number;
  openAnswerText: string;
}

export interface IUserInfo {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  globalScore: number;
}
