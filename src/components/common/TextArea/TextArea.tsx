/* eslint-disable @typescript-eslint/no-explicit-any */
import {FormControl, IInputProps} from 'native-base';
import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import {StyledTextArea} from './styles';

export interface TextAreaProps extends IInputProps {
  name: string;
  autoCompleteType: boolean;
  label?: string;
  helperText?: string;
  ref: any;
  [p: string]: unknown;
}

export const TextArea: React.FC<TextAreaProps> = React.forwardRef(
  ({name, autoCompleteType, label, helperText, ...props}, ref: any) => {
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
              <StyledTextArea
                {...props}
                {...(!hasMessage && {variant: 'withMargin'})}
                autoCompleteType={autoCompleteType}
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
