import {AlarmTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';
import {Select, SelectItem} from '@/components/common/Select';

import {StyledForm} from '../Company/styles';

interface AlarmFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const AlarmSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  type: yup.string().required('Type is a required field'),
  location: yup.string().required('Location is a required field'),
  armingInstructions: yup.string().nullable(),
  disarmingInstruction: yup.string().nullable(),
});

export const AlarmForm = ({loading, control}: AlarmFormProps) => (
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
        <FormControl.Label>Type*</FormControl.Label>
        <Controller
          control={control}
          name="type"
          render={({field: {onChange, value, ...field}}) => (
            <Select
              {...field}
              isDisabled={loading}
              onValueChange={(itemValue: string) => {
                onChange(itemValue);
              }}
              selectedValue={`${value}`}>
              {Object.keys(AlarmTypes).map((item: string) => (
                <SelectItem key={item} label={item} value={item} />
              ))}
            </Select>
          )}
        />
      </FormControl>
      <FormControl mb={5}>
        <FormControl.Label>Location*</FormControl.Label>
        <Controller
          control={control}
          name="location"
          rules={{required: true}}
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
      <FormControl mb={5}>
        <FormControl.Label>Arming Instructions</FormControl.Label>
        <Controller
          control={control}
          name="armingInstructions"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Arming Instructions"
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
        <FormControl.Label>Disarming Instructions</FormControl.Label>
        <Controller
          control={control}
          name="disarmingInstructions"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Disarming Instructions"
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
