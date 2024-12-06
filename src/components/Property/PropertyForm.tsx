import {useGetPropertyTypes} from '@securecore-new-application/securecore-datacore';
import {Checkbox, FormControl} from 'native-base';
import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {TextInput} from '@/components';

import {AddressForm} from '../common/AddressForm';
import {Select, SelectItem} from '../common/Select';
import {StyledForm} from '../Company/styles';

export const PropertySchema = yup
  .object({
    type: yup.string().required('Type is a required field'),
    name: yup.string().required('Name is a required field'),
    address: yup.string().required('Address is a required field'),
    city: yup.string().required('City is a required field'),
    state: yup.string().required('State is a required field'),
    postalcode: yup.string().required('Zip is a required field'),
  })
  .required();

interface PropertyFormProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setValue: UseFormSetValue<FieldValues>;
}

export const PropertyForm = ({
  loading,
  control,
  setValue,
}: PropertyFormProps) => {
  const {data: propertyTypesData} = useGetPropertyTypes({});

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
                {propertyTypesData?.getPropertyTypes.map(item => (
                  <SelectItem
                    key={`${item.title}-${item.id}`}
                    label={item.title}
                    value={`${item.id}`}
                  />
                ))}
              </Select>
            )}
          />
        </FormControl>
        <FormControl>
          <Controller
            control={control}
            name="multiBuilding"
            render={({field: {onChange, value}}) => (
              <Checkbox
                isDisabled={loading}
                value={value}
                isChecked={value}
                onChange={onChange}
                accessibilityLabel="Multi building">
                Multi building
              </Checkbox>
            )}
          />
        </FormControl>
        <AddressForm
          loading={loading}
          control={control}
          setValue={setValue}
          skipRequiredValidation={false}
        />
      </StyledForm>
    </KeyboardAwareScrollView>
  );
};
