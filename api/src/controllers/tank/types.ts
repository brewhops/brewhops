import { IPostgresController } from '../../dal/postgres';
import { RequestHandler } from 'express';

export type Tank = {
  id?: number;
  name: string;
  status: string;
  in_use: boolean;
  update_user?: number;
};

export interface ITankController extends IPostgresController {
  getTanks: RequestHandler;
  getTank: RequestHandler;
  getTankMonitoring: RequestHandler;
  createTank: RequestHandler;
  updateTank: RequestHandler;
  deleteTank: RequestHandler;
}