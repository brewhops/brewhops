import { PostgresController, IPostgresController } from '../../dal/postgres';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { QueryResult } from 'pg';

// tslint:disable: no-unsafe-any

export interface ITaskController extends IPostgresController {
  getTasks: RequestHandler;
  getTasksByBatch: RequestHandler;
  createTask: RequestHandler;
  updateTask: RequestHandler;
}

/**
 * Controller for the tasks route
 * @export
 * @class TaskController
 * @extends {PostgresController}
 * @implements {ITaskController}
 */
export class TaskController extends PostgresController implements ITaskController {

  constructor(tableName: string) {
    super(tableName);
  }

  /**
   * Returns all tasks in the database
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TaskController
   */
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { rows } = await this.read('*', '$1', [true]);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Returns tasks for a batch
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TaskController
   */
  async getTasksByBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { rows } = await this.read('*', 'batch_id = $1', [req.params.batchId]);

      res.status(200).json(rows);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Creates new task in the database
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TaskController
   */
  async createTask(req: Request, res: Response, next: NextFunction) {
    const { id, ...taskInfo } = req.body;

    try {
      const taskExists = await this.pool.query(
        `SELECT * FROM tasks
        WHERE completed_on IS NULL
        AND batch_id = $1`,
        [taskInfo.batch_id]
      );

      if (taskExists.rowCount === 0) {
        // dont let the user try and finish a task that has not started
        if (!taskInfo.completed_on) {

          // parse it out
          const { keys, values, escapes } = this.splitObjectKeyVals(taskInfo);

          const results: QueryResult = await this.createInTable(keys, this.tableName(), escapes, values);

          if (results.rows.length === 1) {
            res.status(201).json(results.rows[0]);
          } else {
            res.status(500).send('Failed to retrieve object after creation.');
          }

        } else {
          res.status(400).send('You can not close a task that has not yet been opened');
        }

      } else {
        res.status(400).send('You can only have one open task per batch.');
      }

    } catch(err) {
      res.status(500).send(err);
    }

  }

  /**
   * Updates existing task in the database
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof TaskController
   */
  async updateTask(req: Request, res: Response, next: NextFunction) {
    const { id, ...taskInfo } = req.body;

    try {

      if (id !== undefined) {
        // parse it out
        const { keys, values } = this.splitObjectKeyVals(taskInfo);
        const { query, idx } = this.buildUpdateString(keys);
        values.push(id);

        // insert a new task
        const results: QueryResult = await this.update(query, `id = \$${idx}`, values);

        if (results.rowCount > 0) {
          res.status(200).json(results.rows[0]);
        } else {
          res.status(404).end();
        }

      } else {
        res.status(400).send('Must include task id.');
      }

    } catch (err) {
      res.status(500).send(err);
    }

  }
}