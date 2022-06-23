import { Ingridient } from '../schemas/recipe.schema';

export interface CreateRecipeDto {
  name: string;
  description: string;
  preparationTime: number;
  ingridients: Ingridient[];
  type: string;
  image: string;
  difficulty: string;
}
