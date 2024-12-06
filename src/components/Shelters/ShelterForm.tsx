import {ShelterInPlaceTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import {FormControl} from 'native-base';
import React from 'react';
import {Control, Controller, FieldValues} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {Divider, TextInput} from '@/components';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';
import {Select, SelectItem} from '@/components/common/Select';
import {StyledForm} from '@/components/Company/styles';

interface ShelterFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
}

export const ShelterSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  type: yup.string().required('Type is a required field'),
  procedure: yup.string(),
});

export const ShelterForm = ({loading, control}: ShelterFormProps) => (
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
              isDisabled={loading}
              onValueChange={(itemValue: string) => {
                onChange(itemValue);
              }}
              {...field}
              selectedValue={value}>
              {Object.values(ShelterInPlaceTypes).map(item => (
                <SelectItem key={item} label={item} value={item} />
              ))}
            </Select>
          )}
        />
      </FormControl>
      <FormControl>
        <Divider text="Procedure" _text={{fontWeight: 600}} />
        <FormControl.Label />
        <Controller
          control={control}
          name="procedure"
          render={({field}) => (
            <HtmlTextArea
              editorTitle="Procedure"
              mode={field.value ? 'edit' : 'add'}
              onChangeText={(val: string) => field.onChange(val)}
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
