import e, { Express } from 'express';
import helmet from 'helmet';

const lambda: Express  = e();
lambda.use(helmet());

lambda.get('*', (req, res) => {
  res.send('hello world');
});

module.exports = lambda;