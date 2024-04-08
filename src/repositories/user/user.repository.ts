import { CustomError } from '../../config';
import { IUserAnswer, UserDto } from '../../interface';
import { AnswerOptionTranslation } from '../model/answer-option-translation.model';
import { AnswerOption } from '../model/answer-option.model';
import { AnswerWeight } from '../model/answer-weight.model';
import { UserAnswer } from '../model/answer.model';
import { CategoryTranslation } from '../model/category-translation.model';
import { Category } from '../model/category.model';
import { Language } from '../model/language.model';
import { ProfileTranslation } from '../model/profile-translation.model';
import { Profile } from '../model/profile.model';
import { QuestionTranslation } from '../model/question-translation.model';
import { Question } from '../model/question.model';
import { User } from './user.model';

export async function findSurveyByProfile(profileId: number, language: string){
  const survey = await Category.findAll({
    attributes: [],
    include: [
      {
        model: CategoryTranslation,
        attributes: ['category'],
        required: true
      },
      {
        model: Question,
        attributes: ['questionNumber'],
        required: true,
        include:[
          {
            model: QuestionTranslation,
            attributes: ['question'],
            required: true,
            include: [
              {
                model: Language,
                required: true,
                attributes: [],
                where: {
                  language
                }
              }
            ],
          },
          {
            model: Profile,
            attributes: [],
            required: true,
            where: {
              id: profileId
            }
          },
          {
            model: AnswerOption,
            attributes: ['id'],
            required: true,
            include: [
              {
                model: AnswerOptionTranslation,
                attributes: ['answerOption'],
                required: true
              }
            ],
          },
        ]
      }
    ]
  });
  return survey;
}

export async function updateUserProfile(userId: number, profileId: number): Promise<CustomError | void> {
  try {
    await User.update(
      { profileId},{
        where: {
          id: userId
        }
      }
    );
  } catch (err: any) {
    return CustomError.badRequest(err.message);
  }
}

export async function findUserById(userId: number): Promise<CustomError | UserDto> {
  try {
    const user = await User.findByPk(userId);
    return userToUserDto(user!);
  } catch (err: any) {
    return CustomError.badRequest(err.message);
  }
}

export function userToUserDto(user: User): UserDto {
  return {
    id: user.id,
    profileId: user.profileId
  };
}


export async function findProfiles(language: string){
  const profiles = await Profile.findAll({
    attributes: ['id', 'photoUrl'],
    include: [
      {
        model: ProfileTranslation,
        attributes: ['profile', 'description', 'videoUrl'],
        required: true,
        include: [
          {
            model: Language,
            attributes: [],
            required: true,
            where: {
              language
            }
          }
        ]
      },
    ]
  });
  return profiles;
}

export async function insertUserAnswer(answer: IUserAnswer): Promise<void> {
  await UserAnswer.create({
    userId: answer.userId,
    questionId: answer.questionId,
    answerOptionId: answer.answerOptionId,
    openAnswerText: answer.openAnswerText
  });
}

export async function updateUserAnser(answer: IUserAnswer): Promise<void> {
  await UserAnswer.update({
    answerOptionId: answer.answerOptionId, 
    openAnswerText: answer.openAnswerText
  }, {
    where: {
      userId: answer.userId,
      questionId: answer.questionId,
    }
  });
}



export async function findAnswerWeights(): Promise<Array<AnswerWeight>> {
  return await AnswerWeight.findAll();
}

export async function findUserAnswers(userId: number): Promise<Array<UserAnswer>> {
  return await UserAnswer.findAll({
    where: {
      userId
    }
  });
}
