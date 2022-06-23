import { Ingredient } from '../schemas/recipe.schema';

export interface CreateRecipeDto {
  name: string;
  description: string;
  preparationTime: number;
  ingredients: Ingredient[];
  type: string;
  image: string;
  difficulty: string;
}
