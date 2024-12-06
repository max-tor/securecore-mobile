import {IndustryTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import {IndustriesSearch} from 'components/common/IndustriesSearch';
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
import {AddressForm} from '@/components/common/AddressForm';
import {HtmlTextArea} from '@/components/common/HtmlTextArea/HtmlTextArea';
import {MaskedInput} from '@/components/common/MaskedInput';
import {PHONE_MASK} from '@/constants';

import {StyledForm} from '../Company/styles';

interface CommunityResourceFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setValue: UseFormSetValue<FieldValues>;
  industryType: IndustryTypes;
}

export const CommunityResourceSchema = yup.object({
  name: yup.string().required('Name is a required field'),
  phone: yup.string().required('Phone is a required field'),
  alternatePhone: yup.string().nullable(),
  email: yup.string().email().nullable(),
  address: yup.string().required('Address is a required field'),
  city: yup.string().required('City is a required field'),
  state: yup.string().required('State is a required field'),
  postalcode: yup.string().required('Zip is a required field'),
  specialNotes: yup.string(),
});

export const CommunityResourceForm = ({
  loading,
  control,
  setValue,
  industryType,
}: CommunityResourceFormProps) => (
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
        <FormControl.Label>Industries*</FormControl.Label>
        <Controller
          control={control}
          name="industries"
          render={({field}) => (
            <IndustriesSearch
              isDisabled={loading}
              {...field}
              setValue={setValue}
              type={industryType}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Phone*</FormControl.Label>
        <Controller
          control={control}
          name="phone"
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
      <AddressForm
        loading={loading}
        control={control}
        setValue={setValue}
        skipRequiredValidation={false}
      />
      <FormControl>
        <Divider text="Special Notes" _text={{fontWeight: 600}} />
        <FormControl.Label />
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
