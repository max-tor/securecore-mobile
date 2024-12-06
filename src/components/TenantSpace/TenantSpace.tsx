import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useGetTenantSpaceInfo,
  useRegisterVisit,
  useRemoveTenantSpace,
} from '@securecore-new-application/securecore-datacore';
import {GET_TENANT_SPACES_BY_BUILDING_ID} from '@securecore-new-application/securecore-datacore/lib/queries';
import {LoginDeviceTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import {TabsConfigItem, TabsScreen} from 'components/common/TabsScreen';
import {useToast} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {TAB_NAMES} from '@/constants/tabs';
import {MainLayout} from '@/layouts';
import {CompanyStackParamList} from '@/navigation/types';
import {ToastNotifications} from '@/notifications/toasts';
import {ParentEntities} from '@/types';

import {AlarmsList} from '../Alarms';
import {CallList} from '../CallList';
import {Header} from '../common/Header';
import {HeaderItemIcon, HeaderItemText} from '../common/Header/styles';
import {IconTypes} from '../common/Icon';
import {ShutOffsList} from '../ShutOffs';
import {EditTenantSpaceModal} from './EditTenantSpaceModal';

export const TenantSpace = () => {
  const {params} =
    useRoute<RouteProp<CompanyStackParamList, 'TenantSpaceScreen'>>();
  const {
    propertyId,
    buildingId,
    companyId,
    id: tenantSpaceId,
    initialTabName,
  } = params;
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);

  const {data, loading, refetch} = useGetTenantSpaceInfo({
    variables: {id: tenantSpaceId},
  });
  const tenantSpace = data?.getTenantSpaceInfo.tenantSpace;
  const address = tenantSpace?.address;
  const name = tenantSpace?.name;
  const image = tenantSpace?.image;

  const toast = useToast();
  const [removeTenantSpace] = useRemoveTenantSpace();
  const [registerVisit] = useRegisterVisit();
  const callRegisterVisit = useCallback(() => {
    if (tenantSpace) {
      registerVisit({
        variables: {
          data: {
            deviceType: LoginDeviceTypes.MOBILE,
            visitEntityType: ParentEntities.TENANT_SPACE,
            visitEntityId: Number(tenantSpaceId),
            sectionUrl: `/company/properties/${propertyId}/buildings/${buildingId}/tenant-space/${tenantSpaceId}`,
          },
        },
      }).then();
    }
  }, [tenantSpace, registerVisit, tenantSpaceId, propertyId, buildingId]);

  useEffect(() => {
    callRegisterVisit();
  }, [callRegisterVisit]);

  useFocusEffect(
    useCallback(() => {
      refetch?.();
    }, [refetch]),
  );

  const onUpload = useCallback(() => refetch?.(), [refetch]);

  const deleteTenantSpace = useCallback(async () => {
    try {
      await removeTenantSpace({
        variables: {id: tenantSpaceId},
        refetchQueries: [
          {query: GET_TENANT_SPACES_BY_BUILDING_ID, variables: {buildingId}},
        ],
      });
      toast.show({
        title: ToastNotifications.PropertyDeleted,
        placement: 'top',
      });
      navigation.goBack();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({message}) {
      toast.show({
        title: `${message}`,
        placement: 'top',
      });
    }
  }, [removeTenantSpace, tenantSpaceId, buildingId, toast, navigation]);

  const openDelete = () => {
    Alert.alert(
      'Delete Tenant Space',
      'Are you sure you want to delete this tenant space?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deleteTenantSpace()},
      ],
    );
  };

  const tabsConfig: TabsConfigItem[] = [
    {
      key: 'alarms',
      tabLabel: TAB_NAMES.ALARMS,
      renderContent: () => (
        <AlarmsList
          companyId={companyId}
          propertyId={propertyId}
          tenantSpaceId={tenantSpaceId}
          onUpload={onUpload}
        />
      ),
    },
    {
      key: 'shutOffs',
      tabLabel: TAB_NAMES.SHUTOFFS,
      renderContent: () => (
        <ShutOffsList
          companyId={companyId}
          propertyId={propertyId}
          tenantSpaceId={tenantSpaceId}
          onUpload={onUpload}
        />
      ),
    },
    {
      key: 'callList',
      tabLabel: TAB_NAMES.CALL_LIST,
      renderContent: () => (
        <CallList
          propertyId={propertyId}
          tenantSpaceId={tenantSpaceId}
          companyId={companyId}
        />
      ),
    },
  ];

  const renderBottom = () => {
    const needsAddress =
      address?.address ||
      address?.city ||
      address?.state ||
      address?.postalcode;

    if (needsAddress) {
      return (
        <>
          <HeaderItemIcon name={IconTypes.Location} size={14} color="#8e8fa1" />
          <HeaderItemText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{width: '100%'}}>
            {`${address?.address}, ${address?.city}, ${address?.state} ${address?.postalcode}`}
          </HeaderItemText>
        </>
      );
    }

    return null;
  };

  return (
    <MainLayout>
      <TabsScreen
        initialTabName={initialTabName}
        minHeaderHeight={40}
        renderHeader={() => (
          <Header
            title="Tenant Space"
            variant="square"
            loading={loading}
            name={name as string}
            image={image as string}
            options={[
              {
                title: 'Edit',
                action: () => {
                  setEditModal(true);
                },
              },
              {
                title: 'Delete',
                action: () => openDelete(),
              },
              {
                title: 'Cancel',
              },
            ]}
            headerBottom={renderBottom()}
            destructiveButtonIndex={1}
            cancelButtonIndex={2}
            fileCount={tenantSpace?.fileCount}
            companyId={companyId}
            propertyId={propertyId}
            buildingId={buildingId}
            tenantSpaceId={tenantSpaceId}
          />
        )}
        tabsConfig={loading ? [] : tabsConfig}
      />
      {editModal && (
        <EditTenantSpaceModal
          closeModal={() => setEditModal(false)}
          tenantSpaceId={tenantSpaceId as number}
        />
      )}
    </MainLayout>
  );
};
