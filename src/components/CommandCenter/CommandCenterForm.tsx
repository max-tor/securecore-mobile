import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';
import {Divider} from '@/components/common/Divider';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';
import {StyledForm} from '@/components/Company/styles';

interface CommandCenterFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const CommandCenterSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  teamFirstLocation: yup.string().required('Team Location is a required field'),
  teamAlternateLocation: yup.string(),
  residentFirstLocation: yup.string(),
  residentAlternateLocation: yup.string(),
  emergencyFirstLocation: yup
    .string()
    .required('Emergency Location is a required field'),
  emergencyAlternateLocation: yup.string(),
  mediaFirstLocation: yup.string(),
  mediaAlternateLocation: yup.string(),
});

export const CommandCenterForm = ({
  loading,
  control,
}: CommandCenterFormProps) => (
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
      <Divider text="Team Location" _text={{color: 'primary.500'}} />
      <FormControl mb={5}>
        <FormControl.Label>First</FormControl.Label>
        <Controller
          control={control}
          name="teamFirstLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="First"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormControl.Label>Alternate</FormControl.Label>
        <Controller
          control={control}
          name="teamAlternateLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Alternate"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <Divider text="Resident Location" />
      <FormControl mb={5}>
        <FormControl.Label>First</FormControl.Label>
        <Controller
          control={control}
          name="residentFirstLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="First"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormControl.Label>Alternate</FormControl.Label>
        <Controller
          control={control}
          name="residentAlternateLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Alternate"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <Divider text="Emergency Location" />
      <FormControl mb={5}>
        <FormControl.Label>First</FormControl.Label>
        <Controller
          control={control}
          name="emergencyFirstLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="First"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormControl.Label>Alternate</FormControl.Label>
        <Controller
          control={control}
          name="emergencyAlternateLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Alternate"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <Divider text="Media Location" />
      <FormControl mb={5}>
        <FormControl.Label>First</FormControl.Label>
        <Controller
          control={control}
          name="mediaFirstLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="First"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={val => field.onChange(val)}
              defaultValue={field.value}
              isDisabled={loading}
              {...field}
            />
          )}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormControl.Label>Alternate</FormControl.Label>
        <Controller
          control={control}
          name="mediaAlternateLocation"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Alternate"
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
