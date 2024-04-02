import { IUserAnswer, ResponseEntity, StatusCode } from '../../interface';
import { userRepository } from '../../repositories';
import { BuildResponse } from '../BuildResponse';

export async function findSurveyByProfile(profileId: number, language: string): Promise<ResponseEntity> {
  try {
    const survey = await userRepository.findSurveyByProfile(profileId, language);
    const categories: ICategory[] = [];
    for(const question of survey){
      const category: ICategory = {
        CategoryTranslation: question.get('CategoryTranslation') as ICategoryTranslation,
        Questions: question.get('Questions') as IQuestion[]
      };
      categories.push(category);
    }
    const response = categories.map((category: ICategory) => {
      return {
        category: category.CategoryTranslation.category,
        questions: category.Questions.map((question: IQuestion) => {
          return {
            questionNumber: question.questionNumber,
            question: question.QuestionTranslation.question,
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
  CategoryTranslation: ICategoryTranslation;
  Questions: IQuestion[];
}

interface ICategoryTranslation {
  category: string;
}
interface IQuestion {
  questionNumber: number;
  QuestionTranslation: IQuestionTranslation;
  AnswerOptions: IAnswerOption[];
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
