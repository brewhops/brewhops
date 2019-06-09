import dotenv from 'dotenv';
import e, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import Boom from 'boom';

// tslint:disable:no-any no-unsafe-any
dotenv.config();

// tslint:disable-next-line:no-var-requires no-require-imports
const cors = require('cors');

const app = e();

app.use(bodyParser.json());
app.use(cors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) =>
    res.status(400).send(Boom.badRequest(err.message)));

module.exports = app;