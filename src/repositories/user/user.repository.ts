import { CustomError } from '../../config';
import { IUserAnswer, UserDto } from '../../interface';
import { 
  AnswerOptionTranslation,
  AnswerOption,
  AnswerWeight,
  UserAnswer,
  CategoryTranslation,
  Category,
  Language,
  ProfileTranslation,
  Profile,
  QuestionTranslation,
  Question
} from '../../models';
import { QuestionType } from '../../models/question-type.model';
import { User } from './user.model';

//export async function findSurveyByProfile(profileId: number, language: string){
//  const survey = await Category.findAll({
//    attributes: ['id'],
//    include: [
//      {
//        model: CategoryTranslation,
//        attributes: ['category'],
//        required: true
//      },
//      {
//        model: Question,
//        attributes: ['id'],
//        required: true,
//        include:[
//          {
//            model: QuestionType,
//            attributes: ['type', 'multiple'],
//            required: true
//          },
//          {
//            model: QuestionTranslation,
//            attributes: ['question'],
//            required: true,
//            include: [
//              {
//                model: Language,
//                required: true,
//                attributes: [],
//                where: {
//                  language
//                }
//              },
//              {
//                model: Profile,
//                attributes: [],
//                required: true,
//                where: {
//                  id: profileId
//                }
//              },
//            ],
//          },
//          {
//            model: AnswerOption,
//            attributes: ['id'],
//            required: true,
//            include: [
//              {
//                model: AnswerOptionTranslation,
//                attributes: ['answerOption'],
//                required: true
//              }
//            ],
//          },
//        ]
//      }
//    ]
//  });
//  return survey;
//}

export async function findSurveyByProfile(profileId: number, language: string){
  const survey = await Category.findAll({
    attributes: ['id'],
    include: [
      {
        model: CategoryTranslation,
        attributes: ['category'],
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
      {
        model: Question,
        attributes: ['id'],
        required: true,
        include: [
          {
            model: QuestionTranslation,
            attributes: ['question'],
            required: true,
            where: {
              profileId
            }
          },
          {
            model: AnswerOption,
            attributes: ['id'],
            required: true,
            //include: [
            //  {
            //    model: AnswerOptionTranslation,
            //    attributes: ['answerOption'],
            //    required: true,
            //  },
            //]
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
    profileId: user.profileId,
    isRegistrationCompleted: user.isRegistrationCompleted
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
