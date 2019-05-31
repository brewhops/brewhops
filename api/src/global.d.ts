import Joi from 'joi';

declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
  }

  interface IdParams {
    id: any;
  }

  type JOIResult = {
    body: Joi.ObjectSchema;
  };
}
