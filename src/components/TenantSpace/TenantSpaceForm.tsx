import {FormControl} from 'native-base';
import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';

import {AddressForm} from '../common/AddressForm';
import {StyledForm} from '../Company/styles';

export const TenantSpaceSchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
    tenantUnit: yup.string(),
    address: yup.string(),
    city: yup.string(),
    state: yup.string(),
    postalcode: yup.string(),
  })
  .required();

interface TenantSpaceFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setValue: UseFormSetValue<FieldValues>;
}

export const TenantSpaceForm = ({
  loading,
  control,
  setValue,
}: TenantSpaceFormProps) => (
  <KeyboardAwareScrollView>
    <StyledForm>
      <FormControl>
        <FormControl.Label>Name*</FormControl.Label>
        <Controller
          control={control}
          name="name"
          render={({field}) => (
            <TextInput isDisabled={loading} type="text" {...field} />
          )}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Unit</FormControl.Label>
        <Controller
          control={control}
          name="tenantUnit"
          render={({field}) => (
            <TextInput isDisabled={loading} type="text" {...field} />
          )}
        />
      </FormControl>
      <AddressForm setValue={setValue} loading={loading} control={control} />
    </StyledForm>
  </KeyboardAwareScrollView>
);
