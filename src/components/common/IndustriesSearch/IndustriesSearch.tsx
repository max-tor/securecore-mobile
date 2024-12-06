import {useSearchIndustries} from '@securecore-new-application/securecore-datacore';
import {Industry} from '@securecore-new-application/securecore-datacore/lib/types';
import {Checkbox, FlatList, Spinner, Text, View} from 'native-base';
import React, {forwardRef, useCallback, useEffect, useState} from 'react';
import {LogBox, TouchableOpacity} from 'react-native';
import {useDebouncedCallback} from 'use-debounce';

import {Modal} from '@/components/common/Modal';
import {StyledInput} from '@/components/common/TextInput/styles';
import {debouncedWait} from '@/constants';

import {
  Placeholder,
  ResultsListItem,
  ResultsListItemDivider,
} from './IndustriesSearch.styles';
import {IndustriesSearchProps} from './types';

LogBox.ignoreLogs([
  'We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320',
]);

export const IndustriesSearch: React.FC<IndustriesSearchProps> = forwardRef(
  (
    {debounceTimeout = debouncedWait, value = [], isDisabled, type, setValue},
    ref,
  ) => {
    const [search, {data: industries, loading}] = useSearchIndustries({});
    const [text, setText] = useState<string>('');
    const [currentOptions, setCurrentOptions] = useState<Industry[]>(value);
    const [selected, setSelected] = useState<Industry[]>(value);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
      setCurrentOptions(value);
      setSelected(value);
    }, [value]);

    useEffect(() => {
      if (!isDisabled && !loading) {
        const searchIndustries =
          industries?.searchIndustries?.map(({id, name}) => ({
            id,
            name,
          })) || value;

        setCurrentOptions(searchIndustries);
      }
    }, [industries?.searchIndustries, isDisabled, loading, value]);

    const onFocus = useCallback(() => {
      setModalVisible(true);
      setText('');
      setCurrentOptions(value);
    }, [value]);

    const onClose = useCallback(() => {
      setModalVisible(false);

      setValue('industries', selected);
    }, [selected, setValue]);

    const makeRequest = async (input: string) => {
      await search({variables: {data: {criteria: input, type}}});
    };

    const debouncedHandleOnSearch = useDebouncedCallback((input: string) => {
      makeRequest(input).then();
    }, debounceTimeout);

    const onChangeText = useCallback(
      (input: string) => {
        if (modalVisible) {
          setText(input);
          if (!input) {
            setCurrentOptions(value);
          }
          debouncedHandleOnSearch(input);
        }
      },
      [debouncedHandleOnSearch, value, modalVisible],
    );

    const onChange = (group: string[]) => {
      const unselected = currentOptions
        .map(({id}) => id)
        .filter(id => !group.includes(`${id}`));

      const result = [
        ...new Map(
          [...selected, ...currentOptions].map(item => [item.id, item]),
        ).values(),
      ].filter(({id}) => !unselected.includes(id));

      setSelected(result);
    };

    const renderItem = ({item: {id, name}}: {item: Industry}) => (
      <ResultsListItem key={id}>
        <Checkbox
          isDisabled={isDisabled || loading}
          value={`${id}`}
          accessibilityLabel={name}>
          {name}
        </Checkbox>
      </ResultsListItem>
    );

    const selectedIds = Object.values(selected).map(item => `${item.id}`);

    return (
      <>
        <TouchableOpacity onPress={onFocus}>
          <View
            ref={ref}
            style={{
              flexDirection: 'row',
              flexGrow: 1,
              flexWrap: 'wrap',
              minHeight: 45,
              height: 'auto',
            }}>
            {!value.length ? (
              <Placeholder>Type to search</Placeholder>
            ) : (
              <Text>
                {value.map(industry => industry?.name).join(' \u2022 ')}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <Modal
          title="Search Industries"
          top={0}
          bottom={0}
          isOpen={modalVisible}
          onClose={onClose}>
          <View flex={1} height={500} overflow="hidden">
            <StyledInput
              placeholder="Type to search"
              value={text}
              onChangeText={onChangeText}
              isRequired={false}
              InputRightElement={
                loading ? <Spinner animating={loading} mr={2} /> : <View />
              }
            />
            <Checkbox.Group
              onChange={onChange}
              value={selectedIds}
              accessibilityLabel="choose numbers">
              <FlatList<Industry>
                data={currentOptions}
                scrollEnabled={false}
                ItemSeparatorComponent={ResultsListItemDivider}
                renderItem={renderItem}
              />
            </Checkbox.Group>
          </View>
        </Modal>
      </>
    );
  },
);
