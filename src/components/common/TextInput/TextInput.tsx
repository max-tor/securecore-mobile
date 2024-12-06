/* eslint-disable @typescript-eslint/no-explicit-any */
import {FormControl, IInputProps} from 'native-base';
import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import {StyledInput} from './styles';

export interface TextInputProps extends IInputProps {
  name: string;
  label?: string;
  helperText?: string;
  ref: any;
  [p: string]: unknown;
}

export const TextInput: React.FC<TextInputProps> = React.forwardRef(
  ({name, label, helperText, ...props}, ref: any) => {
    const {
      control,
      formState: {errors},
    } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, onBlur, value}}) => {
          const hasMessage = Boolean(errors[name]?.message || helperText);

          return (
            <FormControl isInvalid={Boolean(errors[name])}>
              <StyledInput
                {...props}
                {...(!hasMessage && {variant: 'withMargin'})}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                ref={ref}
              />
              {!errors[name]?.message && helperText && (
                <FormControl.HelperText>{helperText}</FormControl.HelperText>
              )}
              <FormControl.ErrorMessage>
                {errors[name]?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          );
        }}
      />
    );
  },
);
