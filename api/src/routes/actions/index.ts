import Boom from 'boom';

import * as appExport from '../../app';
import { ActionController } from '../../controllers/action';
import { ActionValidator } from '../../controllers/action/validate';
import { requireAuthentication } from '../../middleware';

import { IActionController } from '../../controllers/action/types';
import { Application, Router, Request, Response, NextFunction } from 'express';

// tslint:disable-next-line:no-require-imports no-var-requires
const validate = require('express-validation');

const app = <Application>appExport;
const controller: IActionController = new ActionController('tanks');

app.use((req: Request, res: Response, next: NextFunction) => next());

// GET
app.get(
    '/api/actions/',
    async (req, res, next) => controller.getActions(req, res, next)
);
app.get(
    '/api/actions/id/:id',
    async (req, res, next) => controller.getAction(req, res, next)
);

// POST
app.post(
    '/api/actions/',
    validate(ActionValidator.createAction),
    requireAuthentication,
    async (req, res, next) => controller.createAction(req, res, next)
);

// PATCH
app.patch(
    '/api/actions/id/:id',
    validate(ActionValidator.updateAction),
    requireAuthentication,
    async (req, res, next) => controller.updateAction(req, res, next)
);

// DELETE
app.delete(
    '/api/actions/id/:id',
    requireAuthentication,
    async (req, res, next) => controller.deleteAction(req, res, next)
);

app.use(
    '*',
    (req, res) => res.status(404).send(Boom.badRequest(`${req.originalUrl} doesn't exist`))
);