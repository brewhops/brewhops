import Boom from 'boom';

import * as appExport from '../../app';
import { TankController } from '../../controllers/tank';
import { TankValidator } from '../../controllers/tank/validate';
import { requireAuthentication } from '../../middleware';

import { ITankController } from '../../controllers/tank/types';
import { Application, Router, Request, Response, NextFunction } from 'express';

// tslint:disable-next-line:no-require-imports no-var-requires
const validate = require('express-validation');

const app = <Application>appExport;
const controller: ITankController = new TankController('tanks');

app.use((req: Request, res: Response, next: NextFunction) => next());


// GET
app.get(
    '/api/tanks/',
    async (req, res, next) => controller.getTanks(req, res, next)
);
app.get(
    '/api/tanks/id/:id',
    async (req, res, next) => controller.getTank(req, res, next)
);
app.get(
    '/api/tanks/monitoring',
    async (req, res, next) => controller.getTankMonitoring(req, res, next)
);

// POST
app.post(
    '/api/tanks/',
    validate(TankValidator.createTank),
    requireAuthentication,
    async (req, res, next) => controller.createTank(req, res, next)
);

// PATCH
app.patch(
    '/api/tanks/id/:id',
    validate(TankValidator.updateTank),
    requireAuthentication,
    async (req, res, next) => controller.updateTank(req, res, next)
);

// DELETE
app.delete(
    '/api/tanks/id/:id',
    requireAuthentication,
    async (req, res, next) => controller.deleteTank(req, res, next)
);

app.use(
    '*',
    (req, res) => res.status(404).send(Boom.badRequest(`${req.originalUrl} doesn't exist`))
);

module.exports = app;