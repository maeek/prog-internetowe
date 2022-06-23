import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtSecret } from './auth/consts';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { AuthService } from './auth/services/auth.service';
import { UserService } from './auth/services/user.service';
import { UserController } from './auth/user.controller';
import { RolesGuard } from './auth/guards/role.guard';
import { MongoConfigService } from './service/mongo-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipeSchema } from './recipes/schemas/recipe.schema';
import { RecipeController } from './recipes/recipies.controller';
import { RecipesRepository } from './recipes/services/recipes.repository';
import { RecipesService } from './recipes/services/recipes.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '2h' },
    }),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    MongooseModule.forFeature([
      {
        name: 'Recipe',
        schema: RecipeSchema,
        collection: 'recipes',
      },
    ]),
  ],
  controllers: [UserController, RecipeController],
  providers: [
    UserService,
    LocalStrategy,
    JwtStrategy,
    AuthService,
    RolesGuard,
    RecipesRepository,
    RecipesService,
  ],
})
export class AppModule {}
