import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';
import {ProfileForm} from '@/components/common/ProfileForm';

import {StyledForm} from '../Company/styles';

interface PolicyDetailsFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const PolicyDetailsSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  firstName: yup.string().required('First Name is a required field'),
  lastName: yup.string(),
  phone: yup.string().required('Phone is a required field'),
  email: yup.string().email(),
  procedure: yup.string(),
  propertyId: yup.number(),
});

export const PolicyDetailsForm = ({
  loading,
  control,
}: PolicyDetailsFormProps) => (
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
      <ProfileForm
        control={control}
        loading={loading}
        showAlternatePhone={false}
      />
      <FormControl>
        <FormControl.Label>Procedure*</FormControl.Label>
        <Controller
          control={control}
          name="procedure"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Procedure"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
    </StyledForm>
  </KeyboardAwareScrollView>
);
