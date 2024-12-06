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
import {StyledForm} from './styles';

export const CompanySchema = yup
  .object({
    name: yup.string().required('Name is a required field'),
    address: yup.string().required('Address is a required field'),
    city: yup.string().required('City is a required field'),
    state: yup.string().required('State is a required field'),
    postalcode: yup.string().required('Zip is a required field'),
  })
  .required();

interface CompanyFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setValue: UseFormSetValue<FieldValues>;
}

export const CompanyForm = ({loading, control, setValue}: CompanyFormProps) => (
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
      <AddressForm loading={loading} control={control} setValue={setValue} />
    </StyledForm>
  </KeyboardAwareScrollView>
);
