import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import * as yup from 'yup';

import {PHONE_MASK} from '@/constants';

import {MaskedInput} from '../MaskedInput';
import {TextInput} from '../TextInput';

export interface ProfileFormInputs {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  alternatePhone: string;
}

interface ProfileFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  lastNameRequired?: boolean;
  phoneRequired?: boolean;
  showAlternatePhone?: boolean;
}

export const ProfileSchema = yup
  .object({
    firstName: yup.string().required('First Name is a required field'),
    lastName: yup.string().required('Last Name is a required field'),
    phone: yup.string().required('Phone is a required field'),
    alternatePhone: yup.string(),
    email: yup.string().email().nullable(),
  })
  .required();

export const ProfileForm = ({
  loading,
  control,
  lastNameRequired = true,
  phoneRequired = false,
  showAlternatePhone = true,
}: ProfileFormProps) => (
  <>
    <FormControl>
      <FormControl.Label>First Name*</FormControl.Label>
      <Controller
        control={control}
        name="firstName"
        render={({field}) => (
          <TextInput isDisabled={loading} type="text" {...field} />
        )}
      />
    </FormControl>
    <FormControl>
      <FormControl.Label>Last Name{lastNameRequired && '*'}</FormControl.Label>
      <Controller
        control={control}
        name="lastName"
        render={({field}) => (
          <TextInput isDisabled={loading} type="text" {...field} />
        )}
      />
    </FormControl>
    <FormControl>
      <FormControl.Label>Phone{phoneRequired && '*'}</FormControl.Label>
      <Controller
        control={control}
        name="phone"
        render={({field}) => (
          <MaskedInput
            isDisabled={loading}
            type="custom"
            options={{
              mask: PHONE_MASK,
            }}
            {...field}
          />
        )}
      />
    </FormControl>
    {showAlternatePhone && (
      <FormControl>
        <FormControl.Label>Alternate Phone</FormControl.Label>
        <Controller
          control={control}
          name="alternatePhone"
          render={({field}) => (
            <MaskedInput
              type="custom"
              options={{
                mask: PHONE_MASK,
              }}
              {...field}
            />
          )}
        />
      </FormControl>
    )}
    <FormControl>
      <FormControl.Label>Email</FormControl.Label>
      <Controller
        control={control}
        name="email"
        render={({field}) => (
          <TextInput isDisabled={loading} type="text" {...field} />
        )}
      />
    </FormControl>
  </>
);
