import { Sequelize } from 'sequelize';
import { CustomError } from '../../config';
import { IUserAnswer, IUserInfo, IUserUpdate, UserDto } from '../../interface';
import {
  AnswerOption,
  AnswerOptionTranslation,
  AnswerWeight,
  Category,
  CategoryTranslation,
  Language,
  Profile,
  ProfileTranslation,
  Question,
  QuestionTranslation,
  UserAnswer
} from '../../models';
import { QuestionType } from '../../models/question-type.model';
import { User } from './user.model';

export async function findSurveyByProfile(profileId: number, language: string) {
  const result = await Category.findAll({
    include: [
      {
        model: CategoryTranslation,
        required: true,
        include: [
          {
            model: Language,
            attributes: [],
            where: { language: language },
            required: true
          }
        ]
      },
      {
        model: Question,
        include: [
          {
            model: QuestionType,
            attributes: ['type', 'multiple'],
            required: false
          },
          {
            model: QuestionTranslation,
            where: Sequelize.where(
              Sequelize.col('[Questions->QuestionTranslation].languageId'),
              '=',
              Sequelize.col('[CategoryTranslation].languageId')
            ),
            include: [
              {
                model: Profile,
                where: {
                  id: profileId
                },
                required: true,
                include: [
                  {
                    model: ProfileTranslation,
                    where: Sequelize.where(
                      Sequelize.col('[Questions->QuestionTranslation->Profile->ProfileTranslation].languageId'),
                      '=',
                      Sequelize.col('[Questions->QuestionTranslation].languageId')
                    ),
                    required: true
                  }
                ]
              }
            ],
            required: true
          },
          {
            model: AnswerOption,
            required: true,
            include: [
              {
                model: AnswerOptionTranslation,
                where: Sequelize.where(
                  Sequelize.col('[Questions->AnswerOptions->AnswerOptionTranslation].languageId'),
                  '=',
                  Sequelize.col('[Questions->QuestionTranslation].languageId')
                ),
                required: true
              }
            ]
          },
        ],
        required: true
      }
    ],
  });
  return result;
}

export async function updateUserProfile(userId: number, profileId: number): Promise<CustomError | void> {
  try {
    await User.update(
      { profileId }, {
      where: {
        id: userId
      }
    }
    );
  } catch (err: any) {
    return CustomError.badRequest(err.message);
  }
}

export async function updateUser(user: IUserUpdate): Promise<CustomError | string> {
  try {
    console.log(user);
    await User.update(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: `https://kpiglobal.blob.core.windows.net/profile-images/${user.userId}.png`
      }, {
      where: {
        id: user.userId
      }
    }
    );
    return 'Sucessfully update';
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
    profileId: user.profileId,
    isRegistrationCompleted: user.isRegistrationCompleted
  };
}


export async function findProfiles(language: string) {
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

export async function updateUserAnswer(answer: IUserAnswer): Promise<void> {
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

export async function existUserAnswer(answer: IUserAnswer): Promise<boolean> {
  const userAnswer = await UserAnswer.findOne({
    where: {
      questionId: answer.questionId,
    }
  });
  return !!userAnswer;
}


export async function deleteUserAnswer(answer: IUserAnswer): Promise<void> {
  await UserAnswer.destroy({
    where: {
      userId: answer.userId,
      questionId: answer.questionId,
    }
  });
}

export async function findUserInfo(userId: number): Promise<IUserInfo | CustomError> {
  try {
    const user = await User.findOne({
      where: {
        id: userId
      }
    });

    return { firstName: user!.firstName, lastName: user!.lastName, email: user!.email, photoUrl: 'url' };

  } catch (err: any) {
    return CustomError.internalServer(err);
  }
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
