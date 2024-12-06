import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';

import {StyledForm} from '../Company/styles';

interface ShutOffFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const ShutOffSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  location: yup.string().required('Location is a required field'),
  instructions: yup.string().nullable(),
});

export const ShutOffForm = ({loading, control}: ShutOffFormProps) => (
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
        <FormControl.Label>Location*</FormControl.Label>
        <Controller
          control={control}
          name="location"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Location"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Instructions</FormControl.Label>
        <Controller
          control={control}
          name="instructions"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Instructions"
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
