/* eslint-disable @typescript-eslint/no-explicit-any */
import {FormControl, ISelectProps, WarningOutlineIcon} from 'native-base';
import React, {ReactNode} from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import {StyledSelect} from './styles';

export interface SelectProps extends ISelectProps {
  name: string;
  label?: string;
  helperText?: string;
  ref: any;
  [p: string]: unknown;
  children: ReactNode;
}

export const SelectItem = StyledSelect.Item;

export const Select: React.FC<SelectProps> = React.forwardRef(
  ({name, label, helperText, children, ...props}, ref: any) => {
    const {
      control,
      formState: {errors},
    } = useFormContext();

    return (
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => {
          const hasMessage = Boolean(errors[name]?.message || helperText);

          return (
            <FormControl isInvalid={Boolean(errors[name])}>
              <StyledSelect
                {...props}
                ref={ref}
                bg="#fff"
                onValueChange={(itemValue: string) => {
                  onChange(itemValue);
                }}
                {...(!hasMessage && {mb: '5'})}
                selectedValue={`${value}`}>
                {children}
              </StyledSelect>
              {!errors[name]?.message && helperText && (
                <FormControl.HelperText>{helperText}</FormControl.HelperText>
              )}
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                {errors[name]?.message}
              </FormControl.ErrorMessage>
            </FormControl>
          );
        }}
      />
    );
  },
);
