import {AddressAutocomplete} from 'components/common/AddressAutocomplete';
import {FormControl} from 'native-base';
import * as React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormSetValue,
} from 'react-hook-form';

import {TextInput} from '@/components';
import {PlaceSelectedParams} from '@/components/common/AddressAutocomplete/types';
import {states} from '@/constants/states';

import {Select, SelectItem} from '../Select';

interface AddressFormProps {
  control: Control<FieldValues, unknown>;
  loading?: boolean;
  withTitle?: boolean;
  setValue: UseFormSetValue<FieldValues>;
  skipRequiredValidation?: boolean;
  showAddress?: boolean;
  showCity?: boolean;
  showState?: boolean;
  showPostalCode?: boolean;
}

export const AddressForm = ({
  control,
  loading,
  setValue,
  showAddress = true,
  showCity = true,
  showState = true,
  showPostalCode = true,
  skipRequiredValidation = true,
}: AddressFormProps) => {
  const isFullForm = showAddress && showCity && showState && showPostalCode;
  const onPlaceSelected = (place: PlaceSelectedParams) => {
    const formattedAddress = isFullForm
      ? [place.streetNumber, place.street].filter(Boolean).join(' ')
      : place.formattedAddress;

    if (showAddress) setValue?.('address', formattedAddress);
    if (showPostalCode) setValue?.('postalcode', place.postalCode);
    if (showCity) setValue?.('city', place.city);
    if (showState) setValue?.('state', place.state);
  };

  return (
    <>
      <FormControl>
        <FormControl.Label>
          Address{skipRequiredValidation || '*'}
        </FormControl.Label>
        <Controller
          control={control}
          name="address"
          render={({field}) => (
            <AddressAutocomplete
              isDisabled={loading}
              type="text"
              {...field}
              onPlaceSelected={onPlaceSelected}
            />
          )}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>
          City{skipRequiredValidation || '*'}
        </FormControl.Label>
        <Controller
          control={control}
          name="city"
          render={({field}) => (
            <TextInput isDisabled={loading} type="text" {...field} />
          )}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>
          State{skipRequiredValidation || '*'}
        </FormControl.Label>
        <Controller
          control={control}
          name="state"
          render={({field: {onChange, value, ...field}}) => (
            <Select
              isDisabled={loading}
              onValueChange={(itemValue: string) => {
                onChange(itemValue);
              }}
              {...field}
              selectedValue={value}>
              {states.map(state => (
                <SelectItem
                  key={`${state.label}-${state.value}`}
                  label={state.label}
                  value={state.value}
                />
              ))}
            </Select>
          )}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>
          Zip{skipRequiredValidation || '*'}
        </FormControl.Label>
        <Controller
          control={control}
          name="postalcode"
          render={({field}) => (
            <TextInput isDisabled={loading} type="text" {...field} />
          )}
        />
      </FormControl>
    </>
  );
};
