import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useGetBuildingInfo,
  useGetPropertyInfo,
  useRegisterVisit,
  useRemoveBuilding,
} from '@securecore-new-application/securecore-datacore';
import {GET_BUILDINGS_BY_PROPERTY_ID} from '@securecore-new-application/securecore-datacore/lib/queries';
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
import {CommandCenterList} from '../CommandCenter';
import {Header} from '../common/Header';
import {HeaderItemIcon, HeaderItemText} from '../common/Header/styles';
import {IconTypes} from '../common/Icon';
import {EvacuationList} from '../Evacuation';
import {ShutOffsList} from '../ShutOffs';
import {TenantSpaceList} from '../TenantSpace';
import {EditBuildingModal} from './EditBuildingModal';

export const Building = () => {
  const {params} =
    useRoute<RouteProp<CompanyStackParamList, 'BuildingScreen'>>();
  const {propertyId, id: buildingId, initialTabName} = params;
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const {data: propertyData, loading} = useGetPropertyInfo({
    variables: {id: propertyId},
  });
  const property = propertyData?.getPropertyInfo.property;

  const {data, refetch} = useGetBuildingInfo({
    variables: {id: buildingId},
  });
  const building = data?.getBuildingInfo.building;
  const permissions = data?.getBuildingInfo.permissions;
  const address = building?.address;
  const name = building?.name;
  const image = building?.image;

  const toast = useToast();
  const [removeBuilding] = useRemoveBuilding();
  const [registerVisit] = useRegisterVisit();

  useFocusEffect(
    useCallback(() => {
      refetch?.();
    }, [refetch]),
  );

  const callRegisterVisit = useCallback(() => {
    if (building) {
      registerVisit({
        variables: {
          data: {
            deviceType: LoginDeviceTypes.MOBILE,
            visitEntityType: ParentEntities.BUILDING,
            visitEntityId: Number(buildingId),
            sectionUrl: `/company/properties/${propertyId}/buildings/${buildingId}`,
          },
        },
      }).then();
    }
  }, [building, registerVisit, buildingId, propertyId]);

  useEffect(() => {
    callRegisterVisit();
  }, [callRegisterVisit]);

  const onUpload = useCallback(() => refetch?.(), [refetch]);

  const deleteBuilding = useCallback(async () => {
    try {
      await removeBuilding({
        variables: {id: buildingId},
        refetchQueries: [
          {query: GET_BUILDINGS_BY_PROPERTY_ID, variables: {propertyId}},
        ],
      });
      toast.show({
        title: ToastNotifications.BuildingDeleted,
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
  }, [buildingId, navigation, propertyId, removeBuilding, toast]);

  const openDelete = useCallback(() => {
    Alert.alert(
      'Delete Building',
      'Are you sure you want to delete this building?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deleteBuilding()},
      ],
    );
  }, [deleteBuilding]);

  const tabsConfig: TabsConfigItem[] = [
    {
      key: 'alarms',
      tabLabel: TAB_NAMES.ALARMS,
      renderContent: () => (
        <AlarmsList
          companyId={property?.companyId}
          propertyId={propertyId}
          buildingId={buildingId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'commandCenter',
      tabLabel: TAB_NAMES.COMMAND_CENTERS,
      renderContent: () => (
        <CommandCenterList
          companyId={property?.companyId}
          propertyId={propertyId}
          buildingId={buildingId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'evacuations',
      tabLabel: TAB_NAMES.EVACUATIONS,
      renderContent: () => (
        <EvacuationList
          companyId={property?.companyId}
          propertyId={propertyId}
          buildingId={buildingId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'shutOffs',
      tabLabel: TAB_NAMES.SHUTOFFS,
      renderContent: () => (
        <ShutOffsList
          companyId={property?.companyId}
          propertyId={propertyId}
          buildingId={buildingId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'tenantSpaces',
      tabLabel: TAB_NAMES.TENANT_SPACES,
      renderContent: () => (
        <TenantSpaceList
          propertyId={propertyId}
          buildingId={buildingId}
          companyId={property?.companyId as number}
          onUpload={onUpload}
        />
      ),
      visible: property?.propertyTypeId === 3,
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

  const getActionOptions = useCallback(() => {
    const actions = [];

    if (permissions?.update) {
      actions.push({
        title: 'Edit',
        action: () => setEditModal(true),
      });
    }

    if (permissions?.delete) {
      actions.push({
        title: 'Delete',
        action: () => openDelete(),
      });
    }

    if (actions.length) {
      actions.push({
        title: 'Cancel',
      });
    }

    return actions;
  }, [openDelete, permissions?.delete, permissions?.update]);

  return (
    <MainLayout>
      <TabsScreen
        initialTabName={initialTabName}
        minHeaderHeight={40}
        renderHeader={() => (
          <Header
            title="Building"
            variant="square"
            loading={loading}
            name={name as string}
            image={image as string}
            options={getActionOptions()}
            headerBottom={renderBottom()}
            destructiveButtonIndex={1}
            cancelButtonIndex={2}
            fileCount={building?.fileCount}
            companyId={property?.companyId}
            propertyId={propertyId}
            buildingId={buildingId}
          />
        )}
        tabsConfig={loading ? [] : tabsConfig.filter(tab => tab.visible)}
      />
      {editModal && (
        <EditBuildingModal
          closeModal={() => setEditModal(false)}
          buildingId={buildingId}
        />
      )}
    </MainLayout>
  );
};
