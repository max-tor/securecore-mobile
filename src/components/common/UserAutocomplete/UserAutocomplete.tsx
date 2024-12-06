import {useGetCompanyUsers} from '@securecore-new-application/securecore-datacore';
import {User} from '@securecore-new-application/securecore-datacore/lib/types';
import {FlatList, Spinner, Text, View} from 'native-base';
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {TextInput} from '@/components';
import {
  ResultsListItem,
  ResultsListItemDivider,
} from '@/components/common/AddressAutocomplete/AddressAutocomplete.styles';
import {Modal} from '@/components/common/Modal';
import {StyledInput} from '@/components/common/TextInput/styles';
import {UserAutocompleteProps} from '@/components/common/UserAutocomplete/types';
import {useCurrentUser} from '@/hooks/useCurrentUser';

export const UserAutocomplete: React.FC<UserAutocompleteProps> = forwardRef(
  (props, ref: ForwardedRef<unknown>) => {
    const currentUser = useCurrentUser();
    const {onSelectUser, companyId, value, ...rest} = props;
    const {data, loading} = useGetCompanyUsers({
      variables: {id: (currentUser?.companyId || companyId) as number},
    });
    const companyUsers = useMemo(
      () => data?.getCompanyUsers || ([] as User[]),
      [data?.getCompanyUsers],
    );
    const [filteredUsers, setFilteredUsers] = useState<User[]>(companyUsers);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
      if (companyUsers) {
        setFilteredUsers(companyUsers);
      }
    }, [companyUsers]);

    const onFocus = useCallback(() => {
      setModalVisible(true);
    }, []);

    const onCancel = useCallback(() => {
      setModalVisible(false);
    }, []);

    const filterUsers = useCallback(
      (user: User, input: string) => {
        if (!input) {
          return companyUsers;
        }

        return (
          [user.profile?.email, user.profile?.firstName, user.profile?.lastName]
            .join(' ')
            .toUpperCase()
            .indexOf(input.toUpperCase()) !== -1
        );
      },
      [companyUsers],
    );

    const onChangeText = useCallback(
      (input: string | undefined) => {
        if (companyUsers && input) {
          setFilteredUsers(
            companyUsers.filter(user => filterUsers(user, input)),
          );
        }
      },
      [companyUsers, filterUsers],
    );

    const onSelect = useCallback(
      (user: User) => {
        onSelectUser(user);
        onCancel();
      },
      [onCancel, onSelectUser],
    );

    const renderItem = ({item}: {item: User}) => (
      <ResultsListItem onPress={() => onSelect(item)}>
        <Text>
          {item.profile?.firstName} {item.profile?.lastName}
        </Text>
      </ResultsListItem>
    );

    return (
      <>
        <TextInput
          {...rest}
          onPressIn={onFocus}
          contextMenuHidden
          ref={ref}
          placeholder="Search a member from your team"
          value={value}
        />
        <Modal
          title="Search User"
          top={0}
          bottom={0}
          isOpen={modalVisible}
          onClose={onCancel}>
          <View flex={1} height={500} overflow="scroll">
            <StyledInput
              autoFocus
              isDisabled={loading}
              placeholder="Type to search"
              onChangeText={onChangeText}
              InputRightElement={
                loading ? <Spinner animating={loading} mr={2} /> : <View />
              }
            />
            <FlatList<User>
              contentContainerStyle={{paddingVertical: 12}}
              data={filteredUsers}
              scrollEnabled={false}
              ItemSeparatorComponent={ResultsListItemDivider}
              renderItem={renderItem}
            />
          </View>
        </Modal>
      </>
    );
  },
);
