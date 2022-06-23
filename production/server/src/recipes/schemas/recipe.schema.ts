import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type Comment = {
  UserId: string;
  CommentId: string;
  text: string;
  addedAt: number;
};

export interface Ingridient {
  name: string;
  amount: number;
  unit: string;
}

export type RecipeDocument = Recipe & Document;

function transformValue(_, ret: { [key: string]: any }) {
  delete ret._id;
}

@Schema({
  collection: 'Recipes',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
})
export class Recipe {
  @Prop({ required: [true, 'Recipe name cannot be empty'] })
  name: string;

  @Prop({
    required: [true, 'RecipeId cannot be empty'],
    unique: true,
    default: uuidv4,
  })
  readonly RecipeId: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description: string;

  @Prop()
  preparationTime: number;

  @Prop()
  ingridients: Ingridient[];

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;

  @Prop()
  type: string;

  @Prop()
  image: string;

  @Prop()
  difficulty: string;

  @Prop()
  comments: Comment[];
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
