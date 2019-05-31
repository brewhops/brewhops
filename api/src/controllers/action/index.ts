import { PostgresController } from '../../dal/postgres';
import { Request, Response, NextFunction } from 'express';
import { IActionController } from './types';

/**
 * Controller class for the 'actions' routes
 * @export
 * @class ActionController
 * @extends {PostgresController}
 * @implements {IActionController}
 */
export class ActionController extends PostgresController implements IActionController {
  constructor() {
    super('actions');
  }

  /**
   * Returns an array of all available actions.
   * @param req
   * @param res
   */
  async getActions(req: Request, res: Response) {
    try {
      const { rows } = await this.read('*', '$1', [true]);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Returns a single action by id.
   * @param req
   * @param res
   * @param next
   */
  async getAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { rows } = await this.readById(req.params.id);
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        next();
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Creates a new action.
   * @param req
   * @param res
   */
  async createAction(req: Request, res: Response) {
    const { keys, values, escapes } = this.splitObjectKeyVals(req.body);
    try {
      const { rows } = await this.create(keys, escapes, values);
      res.status(201).json(rows[0]);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Updates an action.
   * @param req
   * @param res
   * @param next
   */
  async updateAction(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(400).send('Request does not match valid form');
    } else {
      const { keys, values } = this.splitObjectKeyVals(req.body);
      const { query, idx } = this.buildUpdateString(keys);
      values.push(req.params.id); // add last escaped value for where clause

      try {
        const { rows } = await this.update(query, `id = \$${idx}`, values); // eslint-disable-line
        if (rows.length > 0) {
          res.status(200).json(rows[0]);
        } else {
          next();
        }
      } catch (err) {
        res.status(500).send(err);
      }
    }
  }

  /**
   * Deletes an action.
   * @param req
   * @param res
   * @param next
   */
  async deleteAction(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params;
    try {
      const response = await this.deleteById(id);
      if (response.rowCount > 0) {
        res.status(200).json(`Successfully deleted action (id=${id}).`);
      } else {
        next();
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
}
