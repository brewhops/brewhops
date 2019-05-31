import { Request, Response } from 'express';
import { PostgresController } from '../../dal/postgres';
import { generateAuthToken, userMatchAuthToken } from '../../middleware';
import { IUserController } from './types';


const saltRounds = 8;

const safeUserData = 'id, first_name, last_name, username, phone, admin';


/**
 * Class that defined the logic for the 'user' route
 * @export
 * @class UserController
 * @extends {PostgresController}
 * @implements {IUserController}
 */
export class UserController extends PostgresController implements IUserController {
  constructor(tableName: string) {
    super(tableName);
  }

  /**
   * Returns an array of users
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async getEmployees(req: Request, res: Response) {
    try {
      const { rows } = await this.read(safeUserData, '$1', [true]);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Returns a user by id
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async getEmployee(req: Request, res: Response) {
    try {
      const { rows } = await this.readById(req.params.id);
      res.status(200).json(rows);
    } catch(err) {
      res.status(400).send(err);
    }
  }

  /**
   * Creates a new employee.
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async createEmployee(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      const prevUser = await this.readByUsername(username);
      const { keys, values, escapes } = this.splitObjectKeyVals({...req.body, password});

      if (prevUser.rows.length !== 0) {
        res.status(400).send('Username already taken');
      } else {
        const { rows } = await this.create(keys, escapes, values, safeUserData);
        const returnedUser = rows[0];
        returnedUser.token = await generateAuthToken(returnedUser.username);
        res.status(201).json(rows[0]);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Verifies an employee in the database and returns an authentication token for that user.
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async login(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
      const prevUser = await this.readByUsername(username);
      if (prevUser.rows.length === 0) {
        res.status(401).send('Not authorized');
      } else {
        const id = prevUser.rows[0].id;
        const stored = prevUser.rows[0].password;
        // tslint:disable-next-line:possible-timing-attack
        const match = password === stored;
        if (match) {
          const token = await generateAuthToken(req.body.username);
          res.status(200).json({
            id,
            token
          });
        } else {
          res.status(400).send('Incorrect password');
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Updates an employee's information.
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async updateEmployee(req: Request, res: Response) {
    try {
      const { keys, values } = this.splitObjectKeyVals(req.body);
      const { query, idx } = this.buildUpdateString(keys);
      values.push(req.params.id); // add last escaped value for where clause
      const { rows } = await this.readById(req.params.id);

      if(rows.length > 0 ) {
        if(await this.isAdmin(req.user)) {
          const results = await this.update(query, `id = \$${idx}`, values); // eslint-disable-line
          res.status(200).json(`Deleted ${results.rowCount} user`);
        } else {
          res.status(401).send('Not authorized.');
        }
      } else {
        res.status(500).send('User down not exist');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   * Removes an employee from the database.
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async deleteEmployee(req: Request, res: Response) {
    try {
      const { rows } = await this.readById(req.params.id);
      if(rows.length > 0 ) {
        if(await this.isAdmin(req.user) && !userMatchAuthToken(req.user, rows[0].username)) {
          const results = await this.deleteById(req.params.id);
          res.status(200).json(results.rows);
        } else {
          res.status(401).send('Not authorized.');
        }
      } else {
        res.status(500).send('User down not exist');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }

  /**
   *
   *
   * @param {Request} req
   * @param {Response} res
   * @memberof UserController
   */
  async verifyAdmin(req: Request, res: Response) {
    const { username } = req.params;
    try {
      const isAdmin = await this.isAdmin(username);
      res.status(200).json(isAdmin);
    } catch (err) {
      res.status(200).json(false);
    }
  }

  /**
   * Determines whether the current user is an administrator.
   * @param {string} username
   * @returns
   * @memberof UserController
   */
  async isAdmin(username: string) {
    let isAdmin: boolean = false;
    try {
      const { rows } = await this.readByUsername(username);
      isAdmin = rows[0].admin;
    } catch (err) {
      throw err;
    }

    return isAdmin;
  }
}
