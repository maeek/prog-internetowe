import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from '../dto/createRecipeDto';
import { Comment } from '../schemas/recipe.schema';
import { RecipesRepository } from './recipes.repository';

@Injectable()
export class RecipesService {
  constructor(private readonly recipesRepository: RecipesRepository) {}

  async createRecipe(recipe: CreateRecipeDto & { author: string }) {
    if (
      !recipe.name ||
      !recipe.description ||
      !recipe.preparationTime ||
      !recipe.ingredients ||
      !recipe.type ||
      !recipe.difficulty
    ) {
      throw new BadRequestException('Recipe is not valid');
    }

    const createdRecipe = await this.recipesRepository.create({
      ...recipe,
      comments: [],
      createdAt: Date.now(),
    });

    return {
      id: createdRecipe.RecipeId,
      createdAt: createdRecipe.createdAt,
    };
  }

  async findAll(filters: any, page: number, limit: number) {
    const recipes = await this.recipesRepository.findAll(page, limit, filters);

    return {
      recipes: recipes.map((recipe) => ({
        id: recipe.RecipeId,
        name: recipe.name,
        description: recipe.description,
        preparationTime: recipe.preparationTime,
        ingredients: recipe.ingredients,
        type: recipe.type,
        difficulty: recipe.difficulty,
        image: recipe.image,
        comments: recipe.comments,
        author: recipe.author,
        createdAt: recipe.createdAt,
      })),
    };
  }

  async findOne(id: string) {
    const recipe = await this.recipesRepository.findOne({ RecipeId: id });

    return {
      id: recipe.RecipeId,
      name: recipe.name,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
      ingredients: recipe.ingredients,
      type: recipe.type,
      difficulty: recipe.difficulty,
      image: recipe.image,
      comments: recipe.comments,
      author: recipe.author,
      createdAt: recipe.createdAt,
    };
  }

  async updateRecipe(id: string, recipe: Omit<CreateRecipeDto, 'name'>) {
    const updatedRecipe = await this.recipesRepository.findOneAndUpdate(
      { RecipeId: id },
      {
        ...recipe,
        createdAt: Date.now(),
      },
    );

    return {
      id: updatedRecipe.RecipeId,
      createdAt: updatedRecipe.createdAt,
    };
  }

  async deleteRecipe(id: string) {
    await this.recipesRepository.deleteOne({
      RecipeId: id,
    });

    return null;
  }

  async postComment(id: string, comment: Comment) {
    const recipe = await this.recipesRepository.findOne({ RecipeId: id });

    if (!recipe) {
      throw new BadRequestException('Recipe not found');
    }

    const comments =
      recipe.comments.length === 5 ? recipe.comments.slice(1) : recipe.comments;
    comments.push(comment);

    const updatedRecipe = await this.recipesRepository.findOneAndUpdate(
      { RecipeId: id },
      {
        comments,
      },
    );

    return {
      id: updatedRecipe.RecipeId,
      comments: updatedRecipe.comments,
    };
  }
}
