import { Handler, ValidationErrorType } from 'swagger-object-validator';

const validator = new Handler('./src/swagger/swagger.yaml');

export interface IValidateSwaggerObjectErrors {
  // overall error message
  message: string;
  // array of errors
  errors: Array<{ errorType: ValidationErrorType; trace: string }>;
}

/**
 * Validate a swagger params object against the expected swagger params object definition.
 *
 * @param {*} swaggerParamsObject A swagger params object.
 * - Example: args.swagger.params.MyPostBody.value
 * @param {string} swaggerDefinitionName The name of the swagger object definition that the swagger params object is
 * expected to match.
 * - Example: 'MyPostBodyDefinition'
 * @returns {Promise<IValidateSwaggerObjectErrors>}
 */
export const validateSwaggerObject = async function (
  swaggerParamsObject: any,
  swaggerDefinitionName: string
): Promise<IValidateSwaggerObjectErrors> {
  const validationResult = await validator.validateModel(swaggerParamsObject, swaggerDefinitionName);

  if (validationResult.errors && validationResult.errors.length) {
    return {
      message: 'swagger params object is invalid',
      // convert the original validation errors array into a more condensed and human readable version.
      errors: validationResult.errorsWithStringTypes().map(validationError => {
        return {
          errorType: validationError.errorType,
          // condense the original array of trace strings into a single period delimited string
          trace: validationError.trace.map(traceStep => traceStep.stepName).join('.')
        };
      })
    };
  }

  return { message: 'swagger params object is valid', errors: null };
};
