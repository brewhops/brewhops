import Joi from 'joi';

export interface IActionValidator {
  createAction: () => JOIResult;
  updateAction: () => JOIResult;
}

/**
 * Static validation class for the 'actions' route
 * @export
 * @class ActionValidator
 */
export const ActionValidator: IActionValidator = {
  createAction(): JOIResult {
    return {
      body: Joi.object()
        .keys({
          name: Joi.string().required(),
          description: Joi.string().required()
        })
        .unknown(false)
    };
  },
  updateAction(): JOIResult {
    return {
      body: Joi.object()
        .keys({
          name: Joi.string(),
          description: Joi.string()
        })
        .unknown(false)
    };
  }
};
