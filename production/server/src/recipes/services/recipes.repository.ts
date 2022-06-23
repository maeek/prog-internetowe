/* istanbul ignore file */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Recipe, RecipeDocument } from '../schemas/recipe.schema';

@Injectable()
export class RecipesRepository {
  constructor(
    @InjectModel(Recipe.name) private recipesModel: Model<RecipeDocument>,
  ) {}

  async count(filter?: FilterQuery<RecipeDocument>) {
    return this.recipesModel.count(filter);
  }

  async exists(existsFilterQuery: FilterQuery<RecipeDocument>) {
    return this.recipesModel.exists(existsFilterQuery);
  }

  findOne(recipeFilterQuery: FilterQuery<RecipeDocument>) {
    return this.recipesModel.findOne(recipeFilterQuery);
  }

  async findAll(page = 0, perPage = 100, filter?: FilterQuery<RecipeDocument>) {
    const docsCount = await this.count(filter);
    let pg = Math.max(0, page) * perPage;
    const lm = Math.max(1, perPage);

    // TODO: check if this is correct, im stoned
    if (pg * lm > docsCount) {
      pg = Math.ceil(docsCount / lm);
    }

    return this.find(filter).skip(pg).limit(lm).exec();
  }

  find(recipesFilterQuery?: FilterQuery<RecipeDocument>) {
    return this.recipesModel.find(recipesFilterQuery);
  }

  async create(recipe: Partial<Recipe>) {
    if (await this.exists({ name: recipe.name })) {
      throw new Error('Recipe with this name already exists');
    }

    const newRecipe = new this.recipesModel(recipe);
    return newRecipe.save();
  }

  async remove(recipeFilterQuery: FilterQuery<RecipeDocument>) {
    return this.recipesModel.deleteMany(recipeFilterQuery);
  }

  async findOneAndUpdate(
    recipeFilterQuery: FilterQuery<RecipeDocument>,
    recipe: any,
  ) {
    return this.recipesModel.findOneAndUpdate(recipeFilterQuery, recipe, {
      new: true,
    });
  }

  async deleteOne(recipeFilterQuery: FilterQuery<RecipeDocument>) {
    return this.recipesModel.deleteOne(recipeFilterQuery);
  }
}
