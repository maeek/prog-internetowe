import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/consts';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { CreateRecipeDto } from './dto/createRecipeDto';
import { RecipesService } from './services/recipes.service';
import { Comment } from './schemas/recipe.schema';
import { v4 as uuid } from 'uuid';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  getRecipes(
    @Query('page') page = 0,
    @Query('limit') limit = 20,
    @Query('type') type?: string,
    @Query('difficulty') difficulty?: string,
    @Query('author') author?: string,
  ) {
    const recipes = this.recipesService.findAll(
      type || difficulty || author ? { type, difficulty, author } : undefined,
      page,
      limit,
    );

    return recipes;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addRecipe(@Request() req, @Body() data: CreateRecipeDto) {
    return this.recipesService.createRecipe({
      ...data,
      author: req.user.username,
    });
  }

  @Put('/:id')
  @Roles(Role.ADMIN, Role.MOD)
  @UseGuards(JwtAuthGuard, RolesGuard)
  modifyRecipe(
    @Param('id') id: string,
    @Body() data: Omit<CreateRecipeDto, 'name'> & { comments: Comment[] },
  ) {
    return this.recipesService.updateRecipe(id, data);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteRecipe(@Param('id') id: string) {
    return this.recipesService.deleteRecipe(id);
  }

  @Get('/:id')
  getRecipe(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  @Post('/:id/comment')
  @UseGuards(JwtAuthGuard)
  addComment(
    @Request() req,
    @Param('id') id: string,
    @Body() data: { text: string },
  ) {
    return this.recipesService.postComment(id, {
      text: data.text,
      UserId: req.user.username,
      addedAt: Date.now(),
      CommentId: uuid(),
    });
  }
}
