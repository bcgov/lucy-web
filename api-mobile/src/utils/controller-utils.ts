import {
  Handler,
  IValidatorConfig,
  ValidationErrorType,
  IValidationError,
  ValidationResult
} from 'swagger-object-validator';
import { Schema, Spec } from 'swagger-schema-official';

export type IValidateSwaggerObjectCondensedErrors = Array<{ errorType: ValidationErrorType; trace: string }>;
export interface IValidateSwaggerObject {
  // overall error message
  message: string;
  // array of errors
  errors: IValidateSwaggerObjectCondensedErrors;
}

/**
 * Validate a swagger params object against the expected swagger params object definition.
 *
 * @param {*} swaggerParamsObject A swagger params object.
 * - Example: args.swagger.params.MyPostBody.value
 * @param {string} swaggerDefinitionName The name of the swagger object definition that the swagger params object is
 * expected to match.
 * - Example: 'MyPostBodyDefinition'
 * @param {string} swaggerFilePath The filepath to the swagger file that contains the swaggerDefinitionName to validate
 * against.
 * - Example: './src/swagger/swagger.yaml'
 * @param {IValidatorConfig} [swaggerValidatorConfig=null] An optional custom validator config.
 * - See: https://www.npmjs.com/package/swagger-object-validator#config
 * @returns {Promise<IValidateSwaggerObject>}
 */
export const validateSwaggerObject = async function (
  swaggerParamsObject: any,
  swaggerDefinitionName: string,
  swaggerFilePath: string,
  swaggerValidatorConfig: IValidatorConfig = null
): Promise<IValidateSwaggerObject> {
  const validator = new Handler(swaggerFilePath, swaggerValidatorConfig);

  const validationResult = await validator.validateModel(swaggerParamsObject, swaggerDefinitionName);

  if (!validationResult) {
    return { message: 'unable to validate swagger params   object', errors: null };
  }

  const errors = getCondensedErrorTraceString(validationResult);

  if (!errors) {
    return { message: 'swagger params object is valid', errors: null };
  }

  return { message: 'swagger params object is invalid', errors: errors };
};

/**
 * Convert the original validation errors array into a more condensed and human readable version.
 *
 * @param {ValidationResult} validationResult
 * @returns {IValidateSwaggerObjectCondensedErrors} condensed error string or null if no errors present
 */
export const getCondensedErrorTraceString = function (
  validationResult: ValidationResult
): IValidateSwaggerObjectCondensedErrors {
  if (!validationResult) {
    return null;
  }

  const validationErrors = validationResult.errorsWithStringTypes();

  if (!validationErrors || !validationErrors.length) {
    return null;
  }

  return validationErrors.map(validationError => {
    return {
      errorType: validationError.errorType,
      // condense the original array of trace objects into a single period delimited string
      trace: validationError.trace.map(traceStep => `"${traceStep.stepName}"`).join('.')
    };
  });
};

/**
 * A custom validator config that ignores ADDITIONAL_PROPERTY errors on fields that are defined as being ANY object.
 * - IE: they have `type: object` and NO additional properties
 */
export const ignoreAdditionalPropertyErrorsOnAnyObjectFields: IValidatorConfig = {
  ignoreError: (error: IValidationError, value: any, schema: Schema, spec: Spec) => {
    // Only ADDITIONAL_PROPERTY errors are potentially ignorable
    if (error.errorType !== ValidationErrorType.ADDITIONAL_PROPERTY) {
      return false;
    }

    // Only ignore if schema has `type: object` and no additional properties
    if (Object.keys(schema).length !== 1 || schema.type !== 'object') {
      return false;
    }

    // Ignore additional property errors, as this field was defined as being ANY object.
    return true;
  }
};
