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

import {Divider, TextInput} from '@/components';
import {AddressAutocomplete} from '@/components/common/AddressAutocomplete';
import {PlaceSelectedParams} from '@/components/common/AddressAutocomplete/types';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';
import {MaskedInput} from '@/components/common/MaskedInput';
import {PHONE_MASK} from '@/constants';

import {StyledForm} from '../Company/styles';

interface RelocationFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setValue: UseFormSetValue<FieldValues>;
}

export const RelocationSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  location: yup.string().required('Location is a required field'),
  pointOfContactName: yup.string().nullable(),
  pointOfContactTitle: yup.string().nullable(),
  pointOfContactPhone: yup.string().nullable(),
  specialNotes: yup.string().nullable(),
});

export const RelocationForm = ({
  loading,
  control,
  setValue,
}: RelocationFormProps) => {
  const onPlaceSelected = (place: PlaceSelectedParams) => {
    setValue?.('location', place.formattedAddress);
  };

  return (
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
              <AddressAutocomplete
                isDisabled={loading}
                onPlaceSelected={onPlaceSelected}
                type="text"
                {...field}
              />
            )}
          />
        </FormControl>
        <Divider
          text="Point of Contact"
          _text={{
            fontWeight: 600,
          }}
        />
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Controller
            control={control}
            name="pointOfContactName"
            render={({field}) => (
              <TextInput isDisabled={loading} type="text" {...field} />
            )}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Title</FormControl.Label>
          <Controller
            control={control}
            name="pointOfContactTitle"
            render={({field}) => (
              <TextInput isDisabled={loading} type="text" {...field} />
            )}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Phone</FormControl.Label>
          <Controller
            control={control}
            name="pointOfContactPhone"
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
        <Divider
          text="Special Notes"
          _text={{fontWeight: 600}}
          _viewStyles={{marginBottom: 16}}
        />
        <FormControl>
          <Controller
            control={control}
            name="specialNotes"
            render={({field}) => (
              <HtmlTextArea
                editorTitle="Special Notes"
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
};
