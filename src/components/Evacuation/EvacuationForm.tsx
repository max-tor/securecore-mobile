import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';

import {HtmlTextArea} from '../common/HtmlTextArea/HtmlTextArea';
import {StyledForm} from '../Company/styles';

interface EvacuationFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const EvacuationSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  primaryEvacuationRoute: yup
    .string()
    .required('Primary Evacuation Route is a required field'),
  procedure: yup.string().nullable(),
});

export const EvacuationForm = ({loading, control}: EvacuationFormProps) => (
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
        <FormControl.Label>Primary Evacuation Route*</FormControl.Label>
        <Controller
          control={control}
          name="primaryEvacuationRoute"
          render={({field}) => (
            <HtmlTextArea
              mb={5}
              editorTitle="Primary Evacuation Route"
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
        <FormControl.Label>Procedure</FormControl.Label>
        <Controller
          control={control}
          name="procedure"
          render={({field}) => (
            <HtmlTextArea
              mb={5}
              editorTitle="Procedure"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              autoCompleteType={false}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
    </StyledForm>
  </KeyboardAwareScrollView>
);
