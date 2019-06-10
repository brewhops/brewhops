import Boom from 'boom';

import * as appExport from '../../app';
import { BatchesController } from '../../controllers/batch';
import { BatchesValidator } from '../../controllers/batch/validate';
import { requireAuthentication } from '../../middleware';

import { IBatchesController } from '../../controllers/batch/types';
import { Application, Request, Response, NextFunction } from 'express';

// tslint:disable-next-line:no-require-imports no-var-requires
const validate = require('express-validation');

const app = <Application>appExport;
const controller: IBatchesController = new BatchesController('batches');

app.use((req: Request, res: Response, next: NextFunction) => next());


// GET
app.get(
    '/api/batches/',
    async (req, res, next) => controller.getBatches(req, res, next)
);
app.get(
    '/api/batches/tank/:tankId',
    async (req, res, next) => controller.getBatchesByTank(req, res, next)
);
app.get(
    '/api/batches/recipe/:recipeId',
    async (req, res, next) => controller.getBatchesByRecipe(req, res, next)
);
app.get(
    '/api/batches/id/:id',
    async (req, res, next) => controller.getBatch(req, res, next)
);

// POST
app.post(
    '/api/batches/new',
    validate(BatchesValidator.createBatch),
    requireAuthentication, async (req, res, next) => controller.createBatch(req, res, next)
);
app.post(
    '/api/batches/update',
    validate(BatchesValidator.updateBatch),
    requireAuthentication,
    async (req, res, next) => controller.updateBatch(req, res, next)
);

// PATCH
app.patch(
    '/api/batches/id/:id',
    requireAuthentication,
    async (req, res, next) => controller.patchBatch(req, res, next)
);


// DELETE
app.delete(
    '/api/batches/id/:id',
    requireAuthentication,
    async (req, res, next) => controller.deleteBatch(req, res, next)
);
app.delete(
    '/api/batches/close/:id',
    requireAuthentication,
    async (req, res, next) => controller.closeBatch(req, res, next)
);

app.use(
    '*',
    (req, res) => res.status(404).send(Boom.badRequest(`${req.originalUrl} doesn't exist`))
);

module.exports = app;