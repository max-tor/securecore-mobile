import {ReactNode} from 'react';
import {FieldError, FieldErrors, FieldValues} from 'react-hook-form';

interface ErrorProps<T extends FieldValues> {
  field: string;
  errors: FieldErrors<T>;
}

export function hasError<T extends FieldValues>({
  field,
  errors,
}: ErrorProps<T>) {
  if (errors[field]) {
    return 'error';
  }
}

export function getError<T extends FieldValues>({
  field,
  errors,
}: ErrorProps<T>): FieldError | undefined {
  if (errors[field]) {
    return errors[field] as FieldError;
  }

  return undefined;
}

export function getErrorMessage<T extends FieldValues>({
  field,
  errors,
}: ErrorProps<T>): ReactNode {
  return errors[field]?.message as ReactNode;
}
