import { plainToClass } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { EnvironmentVariables } from './interfaces/environment.service.interface';

export function validateEnvironment(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors: ValidationError[] = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const environment = process.env.NODE_ENV || 'development';

  //filter based on env
  const filteredErrors = errors.filter((error) => {
    if (typeof error.property !== 'string') return false; //secure access
    return environment === 'production'
      ? !error.property.startsWith('DEV_')
      : !error.property.startsWith('PROD_');
  });

  if (filteredErrors.length > 0) {
    throw new Error(formatValidationErrors(filteredErrors));
  }

  return validatedConfig;
}

function formatValidationErrors(errors: ValidationError[]): string {
  return errors
    .map((error) => {
      const property =
        typeof error.property === 'string' ? error.property : 'UnknownProperty';
      const constraints =
        error.constraints && typeof error.constraints === 'object'
          ? Object.values(error.constraints)
              .filter((msg): msg is string => typeof msg === 'string')
              .join(', ')
          : 'Invalid value';
      return `${property}: ${constraints}`;
    })
    .join('; ');
}
