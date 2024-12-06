import {FormControl} from 'native-base';
import React from 'react';
import {Control, FieldValues} from 'react-hook-form';
import * as yup from 'yup';

import {userTitles} from '@/constants';

import {ProfileForm} from '../common/ProfileForm';
import {Select, SelectItem} from '../common/Select';

interface ContactItemFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const ContactItemSchema = yup
  .object({
    title: yup.string().required('Role/Title is a required field'),
    firstName: yup.string().required('First Name is a required field'),
    lastName: yup.string().nullable(),
    phone: yup.string().required('Phone is a required field'),
    alternatePhone: yup.string().nullable(),
    email: yup.string().email().nullable(),
    priority: yup.number().required('Priority is a required field'),
  })
  .required();

const priorityItems = [
  {
    value: 0,
    label: 'High',
    key: 'high',
  },
  {
    value: 1,
    label: 'Medium',
    key: 'medium',
  },
  {
    value: 2,
    label: 'Low',
    key: 'low',
  },
];

export const ContactItemForm = ({loading, control}: ContactItemFormProps) => (
  <>
    <FormControl>
      <FormControl.Label>Role/Title*</FormControl.Label>
      <Select name="title" isDisabled={loading} ref={null}>
        {userTitles.map(item => (
          <SelectItem key={item.key} label={item.label} value={item.label} />
        ))}
      </Select>
    </FormControl>
    <ProfileForm
      control={control}
      loading={loading}
      lastNameRequired={false}
      phoneRequired
    />
    <FormControl>
      <FormControl.Label>Priority*</FormControl.Label>
      <Select name="priority" isDisabled={loading} ref={null}>
        {priorityItems.map(state => (
          <SelectItem
            key={`${state.label}`}
            label={state.label}
            value={`${state.value}`}
          />
        ))}
      </Select>
    </FormControl>
  </>
);
