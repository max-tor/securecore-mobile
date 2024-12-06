import {useNavigation} from '@react-navigation/native';
import {
  useGetCompanyProperties,
  useGetPropertyTypes,
  useRemoveProperty,
} from '@securecore-new-application/securecore-datacore';
import {
  OrderByDirection,
  Property,
  PropertyOrderBy,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {Flex, useToast} from 'native-base';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, View} from 'react-native';

import {useIsTabFocused} from '@/components';
import Icon from '@/components/common/Icon/Icon';
import {IconTypes, propertyIcon} from '@/components/common/Icon/icons';
import {List, ListItemFileCount} from '@/components/common/List';
import {
  GridItem,
  GridItemAvatar,
  GridItemAvatarWrapper,
  GridItemContentBottom,
  GridItemContentTopText,
  GridItemIconWrapper,
  GridViewIconArrow,
  ListHeader,
  ListHeaderLeft,
  ListHeaderLeftText,
  ListItem,
  ListItemActionIcon,
  ListItemAvatar,
  ListItemAvatarWrapper,
  ListItemContentBottom,
  ListItemContentBottomDot,
  ListItemContentBottomIcon,
  ListItemContentBottomText,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconArrow,
  ListItemIconWrapper,
} from '@/components/common/List/styles';
import {PER_PAGE} from '@/constants';
import {ROUTES} from '@/constants/routes';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {HomeScreenNavigationProp} from '@/navigation/types';
import {ToastNotifications} from '@/notifications/toasts';
import {pluralize} from '@/utils/text';

import {ActionSheet} from '../ActionSheet';
import {SortDropdown} from '../common/SortDropdown';
import {LayoutEntityName} from '../common/ViewSwitcher/types';
import {DataLayout, ViewSwitcher} from '../common/ViewSwitcher/ViewSwitcher';
import {FloatingButton} from '../Company/styles';
import {AddPropertyModal} from './AddPropertyModal';
import {EditPropertyModal} from './EditPropertyModal';
import {PropertyStatus} from './PropertyStatus';

interface PropertiesListProps {
  id: number;
  onUpload?: OnUpload;
}

const sortingOptions = [
  {
    label: 'Name A-Z',
    value: 'name-asc',
  },
  {
    label: 'Name Z-A',
    value: 'name-desc',
  },
  {
    label: 'Latest',
    value: 'createdAt-desc',
  },
  {
    label: 'Earliest',
    value: 'createdAt-asc',
  },
];

interface SortingValue {
  value: PropertyOrderBy;
  direction: OrderByDirection;
}

const sortingValues: Record<string, SortingValue> = {
  'name-asc': {
    value: PropertyOrderBy.NAME,
    direction: OrderByDirection.ASC,
  },
  'name-desc': {
    value: PropertyOrderBy.NAME,
    direction: OrderByDirection.DESC,
  },
  'createdAt-desc': {
    value: PropertyOrderBy.CREATED_AT,
    direction: OrderByDirection.DESC,
  },
  'createdAt-asc': {
    value: PropertyOrderBy.CREATED_AT,
    direction: OrderByDirection.ASC,
  },
};

export const PropertiesList = ({id, onUpload}: PropertiesListProps) => {
  const [view, setView] = useState<DataLayout>('list');
  const [propertyId, setPropertyId] = useState<number | null>();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {data: propertyTypesData} = useGetPropertyTypes({});
  const [searchParams, setSearchParams] = useState({
    orderBy: PropertyOrderBy?.CREATED_AT,
    orderByDirection: OrderByDirection.DESC,
  });
  const [sortingLabel, setSortingLabel] = useState('Sort By');
  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const handleSort = useCallback((value: string) => {
    setSortingLabel(sortingOptions.filter(o => o.value === value)[0].label);
    setSearchParams({
      orderBy: sortingValues[value].value,
      orderByDirection: sortingValues[value].direction,
    });
  }, []);
  const currentPage = useRef(0);

  const {data, loading, refetch, fetchMore} = useGetCompanyProperties({
    variables: {
      id,
      pagination: {
        orderBy: searchParams.orderBy,
        orderByDirection: searchParams.orderByDirection,
        limit: PER_PAGE,
        offset: 0,
      },
    },
  });

  const isTabFocused = useIsTabFocused(TAB_NAMES.PROPERTIES);
  const onRefresh = useCallback(() => {
    currentPage.current = 0;
    refetch?.({
      id,
      pagination: {
        orderBy: searchParams.orderBy,
        orderByDirection: searchParams.orderByDirection,
        limit: PER_PAGE,
        offset: currentPage.current * PER_PAGE,
      },
    });
  }, [id, refetch, searchParams.orderBy, searchParams.orderByDirection]);

  useEffect(() => {
    if (isTabFocused) {
      onRefresh();
    }
  }, [isTabFocused, onRefresh]);

  const properties = data?.getCompanyProperties.list;
  const permissions = data?.getCompanyProperties.permissions;

  const fetchMoreItems = useCallback(() => {
    if (properties?.length === data?.getCompanyProperties.count) {
      return;
    }

    currentPage.current += 1;

    fetchMore?.({
      variables: {
        id,
        pagination: {
          limit: PER_PAGE,
          offset: currentPage.current * PER_PAGE,
          orderBy: searchParams.orderBy,
          orderByDirection: searchParams.orderByDirection,
        },
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        const newEntries = fetchMoreResult.getCompanyProperties.list;

        return {
          getCompanyProperties: {
            list: [...previousResult.getCompanyProperties.list, ...newEntries],
            count: fetchMoreResult.getCompanyProperties.count,
            permissions: fetchMoreResult.getCompanyProperties.permissions,
          },
        };
      },
    });
  }, [
    data?.getCompanyProperties.count,
    fetchMore,
    id,
    properties?.length,
    searchParams.orderBy,
    searchParams.orderByDirection,
  ]);

  const [removeProperty] = useRemoveProperty();
  const deleteProperty = useCallback(
    async (propId: number) => {
      try {
        await removeProperty({
          variables: {id: propId},
        });
        toast.show({
          title: ToastNotifications.PropertyDeleted,
          placement: 'top',
        });
        refetch?.();
        setPropertyId(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (message) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [refetch, removeProperty, toast],
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const getPropertyTypeLabel = useCallback(
    (propertyTypeId?: number) => {
      if (propertyTypesData && propertyTypeId) {
        return propertyTypesData.getPropertyTypes.find(
          property => property.id === propertyTypeId,
        )?.title;
      }
    },
    [propertyTypesData],
  );

  const openEdit = (propId: number) => {
    setPropertyId(propId);
    setEditModal(true);
  };

  const openDelete = useCallback(
    (propId: number) => {
      Alert.alert(
        'Delete Property',
        'Are you sure you want to delete this property?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => deleteProperty(propId)},
        ],
      );
    },
    [deleteProperty],
  );

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    (propId: number) => {
      const actions = [];

      actions.push(
        getPickImageActionOption(
          {
            companyId: id,
            propertyId: propId,
          },
          onUpload,
        ),
      );

      if (permissions?.update) {
        actions.push({
          title: 'Edit',
          action: () => openEdit(propId),
        });
      }

      if (permissions?.delete) {
        actions.push({
          title: 'Delete',
          action: () => openDelete(propId),
        });
      }

      if (actions.length) {
        actions.push({
          title: 'Cancel',
        });
      }

      return actions;
    },
    [
      getPickImageActionOption,
      id,
      onUpload,
      openDelete,
      permissions?.delete,
      permissions?.update,
    ],
  );
  const goTo = (itemId: number) => {
    navigation.navigate(ROUTES.COMPANY_STACK, {
      screen: 'PropertyScreen',
      params: {id: itemId},
    });
  };

  const canEditOrDelete = permissions?.update || permissions?.delete;

  const renderListItem = ({item, index}: {item: Property; index?: number}) => {
    const actions = getActionOptions(item.id);
    const destructiveButtonIndex = actions.findIndex(
      ({title}) => title === 'Delete',
    );
    const cancelButtonIndex = actions.findIndex(
      ({title}) => title === 'Cancel',
    );

    return (
      <ListItem
        first={index === 0}
        last={(index || 0) + 1 === properties?.length}
        onPress={() => goTo(item.id)}>
        <ListItemAvatarWrapper>
          <ListItemAvatar
            resizeMode="cover"
            source={{uri: item.image || propertyIcon}}
          />
          {item.multiBuilding && (
            <ListItemIconWrapper>
              <Icon name={IconTypes.Apartment} color="#323234" size={16} />
            </ListItemIconWrapper>
          )}
        </ListItemAvatarWrapper>
        <Flex flexShrink={1} flexGrow={1}>
          <View>
            <ListItemContentTop>
              <ListItemContentTopText>{item.name}</ListItemContentTopText>
            </ListItemContentTop>
            <ListItemContentBottom>
              <ListItemContentBottomText>
                {getPropertyTypeLabel(item.propertyTypeId as number)}
              </ListItemContentBottomText>
              {item.status && (
                <>
                  <ListItemContentBottomDot />
                  <ListItemContentBottomIcon>
                    <PropertyStatus status={item.status} />
                  </ListItemContentBottomIcon>
                  <ListItemContentBottomText>
                    {item.status}
                  </ListItemContentBottomText>
                </>
              )}
            </ListItemContentBottom>
          </View>
        </Flex>
        <ListItemFileCount count={item.fileCount} />
        {canEditOrDelete && (
          <ListItemIconArrow>
            <ActionSheet
              options={actions}
              destructiveButtonIndex={destructiveButtonIndex}
              cancelButtonIndex={cancelButtonIndex}>
              <ListItemActionIcon
                name={IconTypes.Dots}
                color="#8E8FA1"
                size={16}
              />
            </ActionSheet>
          </ListItemIconArrow>
        )}
      </ListItem>
    );
  };

  const renderGridItem = ({item}: {item: Property}) => (
    <GridItem onPress={() => goTo(item.id)}>
      <GridItemAvatarWrapper>
        <GridItemAvatar
          resizeMode="cover"
          source={{uri: item.image || propertyIcon}}
        />
        {item.multiBuilding && (
          <GridItemIconWrapper>
            <Icon name={IconTypes.Apartment} color="#323234" size={10} />
          </GridItemIconWrapper>
        )}
      </GridItemAvatarWrapper>
      <GridItemContentTopText numberOfLines={2} ellipsizeMode="tail">
        {item.name}
      </GridItemContentTopText>
      <GridItemContentBottom>
        <ListItemContentBottomText>
          {getPropertyTypeLabel(item.propertyTypeId as number)}
        </ListItemContentBottomText>
        {item.status && (
          <>
            <ListItemContentBottomDot />
            <ListItemContentBottomIcon>
              <PropertyStatus status={item.status} />
            </ListItemContentBottomIcon>
            <ListItemContentBottomText>{item.status}</ListItemContentBottomText>
          </>
        )}
      </GridItemContentBottom>
      <GridViewIconArrow>
        <ActionSheet
          options={getActionOptions(item.id)}
          destructiveButtonIndex={1}
          cancelButtonIndex={2}>
          <Icon name={IconTypes.Dots} color="#8E8FA1" size={16} />
        </ActionSheet>
      </GridViewIconArrow>
    </GridItem>
  );

  return (
    <>
      {permissions?.create && (
        <FloatingButton onPress={() => setAddModal(true)}>
          + Add Property
        </FloatingButton>
      )}
      <List<Property>
        onRefresh={onRefresh}
        key={view}
        view={view}
        onEndReached={fetchMoreItems}
        renderHeader={() => (
          <ListHeader>
            <ListHeaderLeft>
              <ViewSwitcher
                setView={setView}
                layout={view}
                entity={LayoutEntityName.PROPERTY}
              />
              <ListHeaderLeftText>
                {properties?.length} {pluralize(properties?.length, 'Property')}
              </ListHeaderLeftText>
            </ListHeaderLeft>
            <SortDropdown
              onChange={handleSort}
              sortingOptions={sortingOptions}
              defaultSortLabel={sortingLabel}
            />
          </ListHeader>
        )}
        data={properties}
        loading={loading}
        renderItem={view === 'list' ? renderListItem : renderGridItem}
        keyExtractor={item => `${item.id}`}
      />
      {addModal && (
        <AddPropertyModal
          closeModal={() => setAddModal(false)}
          companyId={id}
          searchParams={searchParams}
        />
      )}
      {editModal && (
        <EditPropertyModal
          closeModal={() => setEditModal(false)}
          propertyId={propertyId as number}
        />
      )}
    </>
  );
};
