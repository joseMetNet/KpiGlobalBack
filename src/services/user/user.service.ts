import { CustomError } from '../../config';
import { IUserAnswer, IUserUpdate, ResponseEntity, StatusCode } from '../../interface';
import { AnswerWeight, ProfileTranslation } from '../../models';
import { userRepository } from '../../repositories';
import { BuildResponse } from '../BuildResponse';
import { uploadFile } from '../helper';

export async function findSurveyByProfile(profileId: number, language: string): Promise<ResponseEntity> {
  try {
    const survey = await userRepository.findSurveyByProfile(profileId, language);
    const categories: ICategory[] = [];
    for (const question of survey) {
      const category: ICategory = {
        id: question.get('id'),
        CategoryTranslation: question.get('CategoryTranslation') as ICategoryTranslation,
        Questions: question.get('Questions') as IQuestion[]
      };
      categories.push(category);
    }
    const response = categories.map((category: ICategory) => {
      return {
        id: category.id,
        category: category.CategoryTranslation.category,
        questions: category.Questions.map((question: IQuestion) => {
          return {
            id: question.id,
            question: question.QuestionTranslation.question,
            type: question.QuestionType.type,
            multiple: question.QuestionType.multiple,
            answerOptions: question.AnswerOptions.map((answer: IAnswerOption) => {
              return {
                id: answer.id,
                answerOption: answer.AnswerOptionTranslation.answerOption,
              };
            })
          };
        })
      };
    });
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
  } catch (err: any) {
    console.log(err);
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function findAnsweredQuestions(profileId: number, language: string, userId?: number): Promise<ResponseEntity> {
  try {
    const survey = await userRepository.findSurveyByProfile(profileId, language);
    const categories: ICategory[] = [];
    for (const question of survey) {
      const category: ICategory = {
        id: question.get('id'),
        CategoryTranslation: question.get('CategoryTranslation') as ICategoryTranslation,
        Questions: question.get('Questions') as IQuestion[]
      };
      categories.push(category);
    }
    const questions = categories.map((category: ICategory) => {
      return {
        id: category.id,
        category: category.CategoryTranslation.category,
        questions: category.Questions.map((question: IQuestion) => {
          return {
            id: question.id,
            question: question.QuestionTranslation.question,
            type: question.QuestionType.type,
            multiple: question.QuestionType.multiple,
            currentAnswer: <ICurrentAnswer[]>[],
            answerOptions: question.AnswerOptions.map((answer: IAnswerOption) => {
              return {
                id: answer.id,
                answerOption: answer.AnswerOptionTranslation.answerOption,
              };
            }),
          };
        })
      };
    });
    if (userId) {
      const userAnswers = await userRepository.findUserAnswers(userId);
      if (userAnswers.length !== 0) {
        for (const category of questions) {
          for (const question of category.questions) {
            for (const answer of userAnswers) {
              if (answer.questionId === question.id) {
                const response = {
                  userAnswerId: answer.answerOptionId,
                  userAnswerText: answer.openAnswerText
                };
                question.currentAnswer.push(response);
              }
            }
          }
        }
      }
    }
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, questions);
  } catch (err: any) {
    console.log(err);
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

interface ICurrentAnswer {
  userAnswerId: number;
  userAnswerText: string;
}

export async function updateUserProfile(userId: number, profileId: number): Promise<ResponseEntity> {
  try {
    await userRepository.updateUserProfile(userId, profileId);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: 'User profile updated' });
  } catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function insertUserResponse(userResponse: IUserAnswer[]): Promise<ResponseEntity> {
  try {
    const userDeletePromises = userResponse.map(item => userRepository.deleteUserAnswer(item));
    await Promise.all(userDeletePromises);
    const userInsertPromises = userResponse.map(item => userRepository.insertUserAnswer(item));
    await Promise.all(userInsertPromises);
    return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, { message: 'Answer correctly saved.' });
  } catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err.message);
  }
}

export async function findProfiles(language: string): Promise<ResponseEntity> {
  try {
    const profiles = await userRepository.findProfiles(language);
    const response = [];
    for (const profile of profiles) {
      const profileTranslation = profile.get('ProfileTranslation') as IProfileTranslation;
      const newProfile = {
        id: profile.id,
        profile: profileTranslation.profile,
        photoUrl: profile.photoUrl,
        videoUrl: profileTranslation.videoUrl,
        description: profileTranslation.description
      };
      response.push(newProfile);
    }
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
  } catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function computeScore(userId: number): Promise<ResponseEntity> {
  try {
    const weights = await userRepository.findAnswerWeights();
    const userAnswers = await userRepository.findUserAnswers(userId);
    const responseWeights = Array<AnswerWeight>();
    for (const answer of userAnswers) {
      for (const weight of weights) {
        if (weight.answerOptionId === answer.answerOptionId && weight.questionId === answer.questionId) {
          responseWeights.push(weight);
        }
      }
    }

    let score = 0.0;
    for (const weight of responseWeights) {
      score = score + (weight.weight * weight.value);
    }
    let description = '';
    if (score < 2) {
      description = 'Por mejorar';
    } else if (score >= 2 && score < 5) {
      description = 'Regular';
    } else if (score >= 5 && score < 7.5) {
      description = 'Bueno';
    } else {
      description = 'Excelente';
    }

    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { score: score, description: description });

  } catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function findScoreByCategory(userId: number, profileId: number) {
  try {
    const survey = await userRepository.findSurveyByProfile(profileId, 'en-US');
    const weights = await userRepository.findAnswerWeights();
    const userAnswers = await userRepository.findUserAnswers(userId);

    const categories: ICategory[] = [];
    for (const category of survey) {
      const newCategory: ICategory = {
        id: category.get('id'),
        CategoryTranslation: category.get('CategoryTranslation') as ICategoryTranslation,
        Questions: category.get('Questions') as IQuestion[],
        score: 0.0
      };
      categories.push(newCategory);
    }

    const question = categories.map((category: ICategory) => {
      const categoryScore = category.Questions.reduce((score, question) => {
        const userAnswer = userAnswers.find(answer => answer.questionId === question.id);
        if (userAnswer) {
          const weight = weights.find(weight => weight.answerOptionId === userAnswer.answerOptionId && weight.questionId === userAnswer.questionId);
          if (weight) {
            score += weight.weight * weight.value;
          }
        }
        return score;
      }, 0);
      return {
        category: category.CategoryTranslation.category,
        categoryScore: categoryScore
      };
    });
    return question;
  } catch (err: any) {
    return CustomError.internalServer(err.message);
  }
}


export interface IScoreByCategoryType {
  id: number;
  category: string;
  questions: {
    id: number;
    question: string;
    type: string;
    multiple: string;
    currentAnswer: ICurrentAnswer[];
    answerOptions: {
      id: number;
      answerOption: string;
    }[];
  }[];
  score: number;
}[];

export async function findUserInfo(userId: number, profileId: number): Promise<ResponseEntity> {
  try {
    const info = await userRepository.findUserInfo(userId);
    if (info instanceof CustomError) {
      return BuildResponse.buildErrorResponse(info.statusCode, { message: info.message });
    }
    //const scoreInfo = { equipo: 1, oportunidad: 1, mercado: 1, resultadosFinancieros: 1, gobiernoCorporativo: 1, impactoSocial: 1, valores: 1, tecnologia: 1 };
    const scoreByCategory = await findScoreByCategory(userId, profileId);
    if (scoreByCategory instanceof CustomError) {
      return BuildResponse.buildErrorResponse(scoreByCategory.statusCode, { message: scoreByCategory.message });
    }

    const globalScore = await computeScore(userId);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { info, globaScore: globalScore.data, scoreByCategory });
  } catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function updateUser(user: IUserUpdate, filePath: string): Promise<ResponseEntity> {
  try {
    const uploadResponse = await uploadFile(user.userId, filePath);
    if (uploadResponse instanceof CustomError) {
      return BuildResponse.buildErrorResponse(StatusCode.BadRequest, { message: uploadResponse.message });
    }
    const userDb = await userRepository.updateUser(user);
    if (userDb instanceof CustomError) {
      return BuildResponse.buildErrorResponse(userDb.statusCode, { message: userDb.message });
    }

    return BuildResponse.buildSuccessResponse(StatusCode.Ok, { message: userDb });
  } catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export interface IProfile {
  id: number;
  photoUrl: string;
  ProfileTranslation: ProfileTranslation;
}

export interface IProfileTranslation {
  id: number;
  languageId: number;
  profileId: number;
  profile: string;
  description: string;
  videoUrl: string;
}

interface ICategory {
  id: number;
  CategoryTranslation: ICategoryTranslation;
  Questions: IQuestion[];
  score?: number;
}

interface ICategoryTranslation {
  id: number;
  languageId: number;
  categoryId: number;
  category: string;
}
interface IQuestion {
  id: number;
  categoryId: number;
  questionNumber: number;
  QuestionType: IQuestionType;
  QuestionTranslation: IQuestionTranslation;
  userAnswer: number;
  AnswerOptions: IAnswerOption[];
}

interface IQuestionType {
  type: string;
  multiple: string;
}

interface IQuestionTranslation {
  id: number;
  languageId: number;
  questionId: number;
  profileId: number;
  question: string;
  Profile: IProfile;
}

interface IAnswerOption {
  id: number;
  questionId: number;
  AnswerOptionTranslation: IAnswerOptionsTranslation
}

interface IAnswerOptionsTranslation {
  id: number;
  languageId: number;
  answerOptionId: number;
  answerOption: string;
}
