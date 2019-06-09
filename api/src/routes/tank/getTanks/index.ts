import * as appExport from '../../../app';
import { TankController } from '../../../controllers/tank';

import { ITankController } from '../../../controllers/tank/types';
import { Application } from 'express';

const app = <Application>appExport;
const controller: ITankController = new TankController('tanks');

app.get('/', async (req, res, next) =>
    controller.getTanks(req, res, next)
);

module.exports = app;