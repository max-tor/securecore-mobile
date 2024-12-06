import {
  useGetAllProcedures,
  useRemoveProcedure,
} from '@securecore-new-application/securecore-datacore';
import {
  OrderBy,
  OrderByDirection,
  Procedure,
  ProcedureTypes,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {Flex, useToast} from 'native-base';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, TouchableOpacity} from 'react-native';

import {useIsTabFocused} from '@/components';
import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {List, ListItemFileCount} from '@/components/common/List';
import {
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconDots,
  ListItemNarrow,
} from '@/components/common/List/styles';
import {ViewProcedureModal} from '@/components/Procedure/ViewProcedureModal';
import {PER_PAGE} from '@/constants';
import {TAB_NAMES} from '@/constants/tabs';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {ToastNotifications} from '@/notifications/toasts';

import {ActionSheet} from '../ActionSheet';

interface ProceduresListProps {
  companyId?: number;
  propertyId?: number;
  onUpload?: OnUpload;
}

export const ProceduresList = ({
  companyId,
  propertyId,
  onUpload,
}: ProceduresListProps) => {
  const [deleteProcedure] = useRemoveProcedure();
  const [procId, setProcId] = useState<number | null>(null);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const currentPage = useRef(0);
  const [searchParams, setSearchParams] = useState({
    orderBy: OrderBy.CREATED_AT,
    orderByDirection: OrderByDirection.DESC,
  });

  const {data, loading, refetch, fetchMore} = useGetAllProcedures({
    pagination: {
      offset: 0,
      limit: PER_PAGE,
      orderByDirection: OrderByDirection.ASC,
      orderBy: OrderBy.CREATED_AT,
    },
    filter: {
      companyId,
      propertyId,
    },
  });

  const procedures = data?.getAllProcedures.list || [];

  const isTabFocused = useIsTabFocused(TAB_NAMES.PROCEDURES);

  const fetchMoreItems = useCallback(() => {
    if (data?.getAllProcedures?.list.length === data?.getAllProcedures.count) {
      return;
    }

    currentPage.current += 1;

    fetchMore?.({
      variables: {
        filter: {
          companyId,
          propertyId,
        },
        pagination: {
          limit: PER_PAGE,
          offset: currentPage.current * PER_PAGE,
          orderBy: searchParams.orderBy,
          orderByDirection: searchParams.orderByDirection,
        },
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        const newEntries = fetchMoreResult.getAllProcedures.list;

        return {
          getAllProcedures: {
            list: [...previousResult.getAllProcedures.list, ...newEntries],
            count: fetchMoreResult.getAllProcedures.count,
            permissions: fetchMoreResult.getAllProcedures.permissions,
          },
        };
      },
    });
  }, [
    companyId,
    data?.getAllProcedures.count,
    data?.getAllProcedures?.list.length,
    fetchMore,
    propertyId,
    searchParams.orderBy,
    searchParams.orderByDirection,
  ]);

  const onRefresh = useCallback(() => {
    currentPage.current = 0;
    refetch?.({
      pagination: {
        offset: 0,
        limit: PER_PAGE,
        orderByDirection: OrderByDirection.ASC,
        orderBy: OrderBy.CREATED_AT,
      },
      filter: {
        companyId,
        propertyId,
      },
    });
  }, [companyId, propertyId, refetch]);

  useEffect(() => {
    if (isTabFocused) {
      onRefresh();
    }
  }, [isTabFocused, onRefresh]);

  const toast = useToast();
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const removeProcedure = useCallback(
    async (id: number) => {
      try {
        await deleteProcedure({
          variables: {
            id,
          },
        });
        setSearchParams({
          orderBy: OrderBy.CREATED_AT,
          orderByDirection: OrderByDirection.DESC,
        });
        currentPage.current = 0;
        refetch?.();
        toast.show({
          title: ToastNotifications.ProcedureDeleted,
          placement: 'top',
        });
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [deleteProcedure, refetch, toast],
  );

  const openView = useCallback((id: number) => {
    setProcId(id);
    setViewModal(true);
  }, []);

  const onModalClose = useCallback(() => {
    setProcId(null);
    setViewModal(false);
  }, []);

  const openDelete = useCallback(
    (id: number) => {
      Alert.alert(
        'Delete Procedure',
        'Are you sure you want to delete this procedure?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              removeProcedure(id);
            },
          },
        ],
      );
    },
    [removeProcedure],
  );

  const globalProcedureAlert = () => {
    Alert.alert(
      'Procedure management',
      'Global Procedures can be managed only by Secure Core team.',
      [
        {
          text: 'Close',
          style: 'cancel',
        },
      ],
    );
  };

  const editAlert = () => {
    Alert.alert(
      'Procedure editing',
      'Procedures can be edited only in web application.',
      [
        {
          text: 'Close',
          style: 'cancel',
        },
      ],
    );
  };

  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const {getPickImageActionOption} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const getActionOptions = useCallback(
    ({id, type}: Procedure) => {
      const actions = [];

      if (type !== ProcedureTypes.GLOBAL) {
        actions.push(
          getPickImageActionOption(
            {
              companyId,
              propertyId,

              procedureId: id,
            },
            onUpload,
          ),
          {
            title: 'Edit',
            action: () => editAlert(),
          },
          {
            title: 'Delete',
            action: () => openDelete(id),
          },
          {
            title: 'Cancel',
          },
        );
      }

      return actions;
    },
    [companyId, getPickImageActionOption, onUpload, openDelete, propertyId],
  );

  const renderListItem = ({item}: {item: Procedure; index?: number}) => {
    const actions = getActionOptions(item);

    return (
      <ListItemNarrow onPress={() => openView(item.id)}>
        <Flex flexShrink={1} flexGrow={1}>
          <ListItemContentTop>
            <ListItemContentTopText>
              {item.name}{' '}
              {item.type === ProcedureTypes.GLOBAL && (
                <Icon name={IconTypes.Global} color="#8E8FA1" size={11} />
              )}
            </ListItemContentTopText>
          </ListItemContentTop>
        </Flex>
        <ListItemFileCount count={item.fileCount} />
        <ListItemIconDots>
          {actions.length ? (
            <ActionSheet
              options={actions}
              destructiveButtonIndex={1}
              cancelButtonIndex={actions.length}>
              <Icon name={IconTypes.Dots} color="#8E8FA1" size={16} />
            </ActionSheet>
          ) : (
            <TouchableOpacity onPress={globalProcedureAlert}>
              <Icon name={IconTypes.Dots} color="#8E8FA1" size={16} />
            </TouchableOpacity>
          )}
        </ListItemIconDots>
        <Icon name={IconTypes.Forward} color="#E6E6F0" size={22} />
      </ListItemNarrow>
    );
  };

  return (
    <>
      <List<Procedure>
        onRefresh={onRefresh}
        data={procedures}
        loading={loading}
        renderItem={renderListItem}
        keyExtractor={(item: Procedure) => `${item.id}`}
        type="narrow"
        onEndReached={fetchMoreItems}
      />
      {viewModal && (
        <ViewProcedureModal
          closeModal={onModalClose}
          procedureId={procId as number}
        />
      )}
    </>
  );
};
