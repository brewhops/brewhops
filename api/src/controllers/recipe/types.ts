import { IPostgresController } from '../../dal/postgres';
import { RequestHandler } from 'express';

export type Recipe = {
  name: string;
  airplane_code: string;
  yeast: number;
  instructions: {};
  update_user?: number;
};

export interface IRecipeController extends IPostgresController {
  getRecipes: RequestHandler;
  getRecipe: RequestHandler;
  createRecipe: RequestHandler;
  updateRecipe: RequestHandler;
  deleteRecipe: RequestHandler;
}