import axios from 'axios';
import {FlatList, Spinner, Text, View} from 'native-base';
import * as Qs from 'qs';
import React, {ForwardedRef, forwardRef, useCallback, useState} from 'react';
import Config from 'react-native-config';
import {useDebouncedCallback} from 'use-debounce';

import {TextInput} from '@/components';
import {
  ResultsListItem,
  ResultsListItemDivider,
} from '@/components/common/AddressAutocomplete/AddressAutocomplete.styles';
import {
  AddressAutoCompleteProps,
  AutoCompleteOption,
  GeocoderAddressComponent,
} from '@/components/common/AddressAutocomplete/types';
import {Modal} from '@/components/common/Modal';
import {StyledInput} from '@/components/common/TextInput/styles';

const REQUEST_URL = 'https://maps.googleapis.com/maps/api';
const apiKey = Config.GOOGLE_API_KEY;

export const AddressAutocomplete: React.FC<AddressAutoCompleteProps> =
  forwardRef((props, ref: ForwardedRef<unknown>) => {
    const {onPlaceSelected, value, ...rest} = props;
    const [text, setText] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const [searchOptions, setSearchOptions] = useState<AutoCompleteOption[]>(
      [],
    );

    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const onFocus = useCallback(() => {
      setModalVisible(true);
    }, []);

    const onCancel = useCallback(() => {
      setModalVisible(false);
    }, []);

    const makeRequest = async (input: string) => {
      setLoading(true);
      const url = `${REQUEST_URL}/place/autocomplete/json?input=${encodeURIComponent(
        input,
      )}&${Qs.stringify({
        key: apiKey,
        language: 'en',
        components: 'country:us',
        type: 'address',
      })}`;

      try {
        const {data} = await axios.get(url);

        if (data.predictions) {
          setSearchOptions(
            (data.predictions || []).map((datum: Record<string, unknown>) => ({
              value: datum.description || 'error',
              data: datum,
            })),
          );
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    const debouncedHandleOnSearch = useDebouncedCallback(
      input => {
        if (input) {
          makeRequest(input);
        }
      },
      // delay in ms
      500,
    );

    const onChangeText = useCallback(
      (input: string | undefined) => {
        setText(input);
        debouncedHandleOnSearch(input);
      },
      [debouncedHandleOnSearch],
    );

    const getAddressComponent = (
      data: GeocoderAddressComponent[],
      type: string,
    ) => data.find(component => component.types.includes(type));

    const onSelect = useCallback(
      async (placeId: string) => {
        const url = `${REQUEST_URL}/place/details/json?place_id=${encodeURIComponent(
          placeId,
        )}&${Qs.stringify({
          // eslint-disable-next-line camelcase
          place_id: placeId,
          fields: 'name,formatted_address,address_components',
          key: apiKey,
        })}`;

        try {
          const {data} = await axios.get(url);

          if (data.status === 'OK') {
            const result: GeocoderAddressComponent[] =
              data.result?.address_components ?? [];

            onPlaceSelected?.({
              formattedAddress: data.result?.formatted_address,
              postalCode: getAddressComponent(result, 'postal_code')?.long_name,
              state: getAddressComponent(result, 'administrative_area_level_1')
                ?.short_name,
              city:
                getAddressComponent(result, 'locality')?.long_name ||
                getAddressComponent(result, 'sublocality_level_1')?.long_name,
              street: getAddressComponent(result, 'route')?.short_name,
              streetNumber: getAddressComponent(result, 'street_number')
                ?.short_name,
            });
          }

          setModalVisible(false);
          setSearchOptions([]);
          setText(undefined);
        } catch (e) {
          console.log(e);
        }
      },
      [onPlaceSelected],
    );

    const renderItem = ({item}: {item: AutoCompleteOption}) => (
      <ResultsListItem onPress={() => onSelect(item.data.place_id)}>
        <Text>{item.value}</Text>
      </ResultsListItem>
    );

    return (
      <>
        <TextInput
          value={value}
          {...rest}
          onPressIn={onFocus}
          contextMenuHidden
          ref={ref}
        />
        <Modal
          title="Search Address"
          top={0}
          bottom={0}
          isOpen={modalVisible}
          onClose={onCancel}>
          <View flex={1} height={500} overflow="hidden">
            <StyledInput
              placeholder="Type to search"
              value={text}
              onChangeText={onChangeText}
              InputRightElement={
                loading ? <Spinner animating={loading} mr={2} /> : <View />
              }
            />
            <FlatList<AutoCompleteOption>
              contentContainerStyle={{paddingVertical: 12}}
              data={searchOptions}
              scrollEnabled={false}
              ItemSeparatorComponent={ResultsListItemDivider}
              renderItem={renderItem}
            />
          </View>
        </Modal>
      </>
    );
  });
