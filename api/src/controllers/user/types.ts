import { IPostgresController } from '../../dal/postgres';
import { RequestHandler } from 'express';

export type Employee = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  password?: string;
  phone: string;
  admin: boolean;
};

// tslint:disable:no-any no-unsafe-any
export interface IUserController extends IPostgresController {
  getEmployees: RequestHandler;
  getEmployee: RequestHandler;
  createEmployee: RequestHandler;
  login: RequestHandler;
  updateEmployee: RequestHandler;
  deleteEmployee: RequestHandler;
  verifyAdmin: RequestHandler;
  isAdmin: (id: string) => Promise<boolean>;
}
