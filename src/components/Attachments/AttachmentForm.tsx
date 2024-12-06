import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';

import {StyledForm} from '../Company/styles';

export const PropertySchema = yup
  .object({name: yup.string().required('Name is a required field')})
  .required();

interface AttachmentFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const AttachmentForm = ({loading, control}: AttachmentFormProps) => (
  <KeyboardAwareScrollView>
    <StyledForm>
      <FormControl>
        <FormControl.Label>Name*</FormControl.Label>
        <Controller
          control={control}
          name="name"
          render={({field}) => (
            <TextInput
              isDisabled={loading}
              type="text"
              {...field}
              keyboardType="ascii-capable"
            />
          )}
        />
      </FormControl>
    </StyledForm>
  </KeyboardAwareScrollView>
);
