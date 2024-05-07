import { CustomError } from '../../config';
import { Question, UserAnswer } from '../../models';

export async function findLastInsertedCategory(userId: number): Promise<CustomError | number> {
  try {
    const userAnswers = await UserAnswer.findAll({
      attributes: ['questionId'],
      where: {
        userId
      },
      raw: true
    });
    const maxQuestionIdAnswered = Math.max(...userAnswers.map(item => item.questionId));
    if(!isFinite(maxQuestionIdAnswered)){
      return -1;
    }
    const question = await Question.findOne({
      attributes: ['categoryId'],
      where: {
        id: maxQuestionIdAnswered
      }
    });
    return question!.get('categoryId');
  }
  catch(err: any){
    return CustomError.notFound('User not found');
  }
}
