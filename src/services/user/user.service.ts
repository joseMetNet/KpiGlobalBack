import { IUserAnswer, ResponseEntity, StatusCode } from '../../interface';
import { userRepository } from '../../repositories';
import {AnswerWeight } from '../../models';
import { BuildResponse } from '../BuildResponse';

export async function findSurveyByProfile(profileId: number, language: string): Promise<ResponseEntity> {
  try {
    const survey = await userRepository.findSurveyByProfile(profileId, language);
    const categories: ICategory[] = [];
    for(const question of survey){
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
  }catch(err: any) {
    console.log(err);
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function findAnsweredQuestions(profileId: number, language: string, userId: number): Promise<ResponseEntity> {
  try {
    const survey = await userRepository.findSurveyByProfile(profileId, language);
    const categories: ICategory[] = [];
    for(const question of survey){
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
            userAnswerId: -1,
            userAnswerText: '',
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
    const userAnswers = await userRepository.findUserAnswers(userId);
    for (const category of questions){
      for (const question of category.questions){
        for (const answer of userAnswers){
          if (answer.questionId===question.id){
            question.userAnswerId = answer.answerOptionId;
            question.userAnswerText = answer.openAnswerText;
          }
        }
      }
    }
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, questions);
  }catch (err: any) {
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}


export async function updateUserProfile(userId: number, profileId: number): Promise<ResponseEntity>{
  try {
    await userRepository.updateUserProfile(userId, profileId);
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, {message: 'User profile updated'});
  }catch(err: any){
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function insertUserResponse(userResponse: IUserAnswer[]): Promise<ResponseEntity>{
  try{
    for(const response of userResponse){
      await userRepository.insertUserAnswer(response);
    }
    return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {message: 'Answer correctly saved.'});
  }catch(err: any){
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err.message);
  }
}

export async function updateUserResponse(userResponse: IUserAnswer[]): Promise<ResponseEntity>{
  try{
    for(const response of userResponse){
      await userRepository.updateUserAnser(response);
    }
    return BuildResponse.buildSuccessResponse(StatusCode.ResourceCreated, {message: 'Answer correctly saved.'});
  }catch(err: any){
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err.message);
  }
}

export async function findProfiles(language: string): Promise<ResponseEntity>{
  try {
    const profiles = await userRepository.findProfiles(language);
    const response: IProfile[] = [];
    for(const profile of profiles){
      const profileTranslation = profile.get('ProfileTranslation') as IProfileTranslation;
      const newProfile: IProfile = {
        id: profile.id,
        profile: profileTranslation.profile,
        photoUrl: profile.photoUrl,
        videoUrl: profileTranslation.videoUrl,
        description: profileTranslation.description
      };
      response.push(newProfile);
    }
    return BuildResponse.buildSuccessResponse(StatusCode.Ok, response);
  }catch(err: any){
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export async function computeScore(userId: number): Promise<ResponseEntity> {
  try {
    const weights = await userRepository.findAnswerWeights();
    const userAnswers = await userRepository.findUserAnswers(userId);
    const responseWeights = Array<AnswerWeight>();
    for(const answer of userAnswers){
      for(const weight of weights){
        if(weight.answerOptionId===answer.answerOptionId && weight.questionId===answer.questionId){
          responseWeights.push(weight);
        }
      }
    }

    console.log(JSON.stringify(responseWeights));

    let score = 0.0;
    for(const weight of responseWeights){
      score = score + (weight.weight*weight.value);
    }
    let description = '';
    if(score <2){
      description = 'Por mejorar';
    }else if(score>=2 && score<5){
      description = 'Regular';
    }else if(score>=5 && score<7.5){
      description = 'Bueno';
    }else{
      description = 'Excelente';
    }

    return BuildResponse.buildSuccessResponse(StatusCode.Ok, {score: score, description: description});

  }catch(err: any){
    return BuildResponse.buildErrorResponse(StatusCode.InternalErrorServer, err);
  }
}

export interface IProfile {
  id:                 number;
  profile:            string;
  photoUrl:           string;
  videoUrl:           string;
  description:        string;
}

export interface IProfileTranslation {
  profile:     string;
  description: string;
  videoUrl:    string;
}

interface ICategory {
  id: number;
  CategoryTranslation: ICategoryTranslation;
  Questions: IQuestion[];
}

interface ICategoryTranslation {
  category: string;
}
interface IQuestion {
  id: number;
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
  question: string
}
interface IAnswerOption {
  id: number,
  AnswerOptionTranslation: IAnswerOptionsTranslation
}

interface IAnswerOptionsTranslation {
  id:           number;
  answerOption: string;
}
