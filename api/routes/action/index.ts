import e, { Express } from 'express';
import helmet from 'helmet';
import { IActionController } from '../../src/controllers/action/types';
import { ActionController } from '../../src/controllers/action';
import { requireAuthentication } from '../../src/middleware';
import { ActionValidator } from '../../src/controllers/action/validate';
import validate from 'express-validation';

const controller: IActionController = new ActionController();

const lambda: Express  = e();
lambda.use(helmet());

lambda.get('/', async (req, res, next) => controller.getActions(req, res, next));
lambda.post('/', validate(ActionValidator.createAction), requireAuthentication, async (req, res, next) => controller.createAction(req, res, next));

export default lambda;