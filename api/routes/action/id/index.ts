import e, { Express } from 'express';
import helmet from 'helmet';
import { IActionController } from '../../../src/controllers/action/types';
import { ActionController } from '../../../src/controllers/action';
import { requireAuthentication } from '../../../src/middleware';
import { ActionValidator } from '../../../src/controllers/action/validate';
import validate from 'express-validation';

const controller: IActionController = new ActionController();

const lambda: Express  = e();
lambda.use(helmet());

lambda.get('/:id', async (req, res, next) => controller.getAction(req, res, next));
lambda.patch('/:id', validate(ActionValidator.updateAction), requireAuthentication, async (req, res, next) => controller.updateAction(req, res, next));
lambda.delete('/:id', requireAuthentication, async (req, res, next) => controller.deleteAction(req, res, next));

module.exports = lambda;