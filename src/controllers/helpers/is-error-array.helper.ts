import { ValidationError } from 'class-validator';

// Check if the error is an array of ValidationError
export function isErrorArray(errors: unknown): errors is ValidationError[] {
  return (
    Array.isArray(errors) && errors.every((error) => 'constraints' in error)
  );
}
