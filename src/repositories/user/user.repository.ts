import { AnswerOption } from '../model/answer-option.model';
import { Category } from '../model/category.model';
import { Language } from '../model/language.model';
import { Profile } from '../model/profile.model';
import { Question } from '../model/question.model';

export async function findSurveyByProfile(profileId: number, categoryId: number, language: string){
	const survey = await Question.findAll({
		include: [
			{
				model: Profile,
				required: true,
				where: {
					id: profileId
				}
			},
			{
				model: AnswerOption,
				required: true
			},
			{
				model: Category,
				required: true,
				where: {
					id: categoryId
				}
			},
			{
				model: Language,
				required: true,
				where: {
					language: language
				}
			}
		]
	});
	return survey;
}

export async function findProfiles(){
	return await Profile.findAll();
}
