import { IPostgresController } from '../../dal/postgres';
import { RequestHandler } from 'express-serve-static-core';

export type Action = {
  id?: number;
  name: string;
  description: string;
};

export interface IActionController extends IPostgresController {
  getActions: RequestHandler;
  getAction: RequestHandler;
  createAction: RequestHandler;
  updateAction: RequestHandler;
  deleteAction: RequestHandler;
}