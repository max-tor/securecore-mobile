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

export const BuildingSchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
    address: yup.string().required('Address is a required field'),
    city: yup.string().required('City is a required field'),
    state: yup.string().required('State is a required field'),
    postalcode: yup.string().required('Postal Code is a required field'),
  })
  .required();

interface BuildingFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setValue: UseFormSetValue<FieldValues>;
}

export const BuildingForm = ({
  loading,
  control,
  setValue,
}: BuildingFormProps) => (
  <KeyboardAwareScrollView>
    <StyledForm>
      <FormControl>
        <FormControl.Label>Building Name*</FormControl.Label>
        <Controller
          control={control}
          name="name"
          render={({field}) => (
            <TextInput isDisabled={loading} type="text" {...field} />
          )}
        />
      </FormControl>
      <AddressForm
        setValue={setValue}
        loading={loading}
        control={control}
        skipRequiredValidation={false}
      />
    </StyledForm>
  </KeyboardAwareScrollView>
);
