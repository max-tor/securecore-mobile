/* eslint-disable @typescript-eslint/no-explicit-any */
import {FormControl, WarningOutlineIcon} from 'native-base';
import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {TextInputMask, TextInputMaskProps} from 'react-native-masked-text';

import {StyledInput} from '../TextInput/styles';

export interface MaskedInputProps extends TextInputMaskProps {
  name: string;
  label?: string;
  helperText?: string;
  ref: any;
  [p: string]: unknown;
}

export const MaskedInput: React.FC<MaskedInputProps> = React.forwardRef(
  ({name, label, helperText, type, options, ...props}, ref: any) => {
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
              <TextInputMask
                customTextInput={StyledInput}
                type={type}
                options={options}
                {...props}
                {...(!hasMessage && {variant: 'withMargin'})}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                refInput={ref}
              />
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
