import express, { Express } from 'express';
import helmet from 'helmet';

const lambda: Express  = express();
lambda.use(helmet());

lambda.get('*', (req, res) => {
  res.send('hello world');
});

module.exports = lambda;