import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useGetPropertyInfo,
  useGetPropertyTeam,
  useRegisterVisit,
  useRemoveProperty,
} from '@securecore-new-application/securecore-datacore';
import {GET_COMPANY_PROPERTIES} from '@securecore-new-application/securecore-datacore/lib/queries';
import {
  EmergencyResources,
  IndustryTypes,
  LoginDeviceTypes,
  OrderByDirection,
  PolicyDetailTypes,
  PropertyOrderBy,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {TabsConfigItem, TabsScreen} from 'components/common/TabsScreen';
import {useToast} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';

import {PolicyDetailsList} from '@/components/PolicyDetails';
import {TAB_NAMES} from '@/constants/tabs';
import {MainLayout} from '@/layouts';
import {CompanyStackParamList} from '@/navigation/types';
import {ToastNotifications} from '@/notifications/toasts';
import {ParentEntities} from '@/types';

import {AlarmsList} from '../Alarms';
import {BuildingsList} from '../Buildings';
import {CallList} from '../CallList';
import {CommandCenterList} from '../CommandCenter';
import {Header} from '../common/Header';
import {
  HeaderItemDot,
  HeaderItemIcon,
  HeaderItemIconStatus,
  HeaderItemText,
} from '../common/Header/styles';
import {Icon, IconTypes, propertyIcon} from '../common/Icon';
import {CommunityResourcesList} from '../CommunityResources';
import {EvacuationList} from '../Evacuation';
import {HazardousMaterialsList} from '../HazardousMaterials';
import {ProceduresList} from '../Procedure';
import {RelocationsList} from '../Relocations';
import {SheltersList} from '../Shelters';
import {ShutOffsList} from '../ShutOffs';
import {TeamList} from '../Team';
import {EditPropertyModal} from './EditPropertyModal';
import {PropertyStatus} from './PropertyStatus';

export const Property = () => {
  const {params} =
    useRoute<RouteProp<CompanyStackParamList, 'PropertyScreen'>>();
  const {initialTabName, id: propertyId} = params;
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);
  const {data, loading, refetch} = useGetPropertyInfo({
    variables: {id: propertyId},
  });
  const property = data?.getPropertyInfo.property;
  const permissions = data?.getPropertyInfo.permissions;
  const address = property?.address;
  const name = property?.name;
  const image = property?.image;
  // TODO remove comment to add property type.
  // const typeProperty = property?.type;
  const statusProperty = property?.status;
  const toast = useToast();
  const [removeProperty] = useRemoveProperty();
  const [registerVisit] = useRegisterVisit();

  const callRegisterVisit = useCallback(() => {
    if (data?.getPropertyInfo.property) {
      registerVisit({
        variables: {
          data: {
            deviceType: LoginDeviceTypes.MOBILE,
            visitEntityType: ParentEntities.PROPERTY,
            visitEntityId: Number(propertyId),
            sectionUrl: `/company/properties/${propertyId}`,
          },
        },
      }).then();
    }
  }, [data?.getPropertyInfo.property, registerVisit, propertyId]);

  useEffect(() => {
    callRegisterVisit();
  }, [callRegisterVisit]);

  useFocusEffect(
    useCallback(() => {
      refetch?.();
    }, [refetch]),
  );

  const onUpload = useCallback(() => refetch?.(), [refetch]);

  const deleteProperty = useCallback(async () => {
    try {
      await removeProperty({
        variables: {id: propertyId},
        refetchQueries: [
          {
            query: GET_COMPANY_PROPERTIES,
            variables: {
              id: property?.company?.id as number,
              order: {
                orderBy: PropertyOrderBy?.CREATED_AT,
                orderByDirection: OrderByDirection.DESC,
              },
            },
          },
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
  }, [removeProperty, propertyId, property?.company?.id, toast, navigation]);

  const {
    data: teamData,
    refetch: refetchTeam,
    loading: loadingTeam,
  } = useGetPropertyTeam({
    variables: {propertyId},
  });
  const team = teamData?.getPropertyTeam?.teamMembers;
  const teamPermissions = teamData?.getPropertyTeam?.permissions;
  const openDelete = useCallback(() => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deleteProperty()},
      ],
    );
  }, [deleteProperty]);

  const tabsConfig: TabsConfigItem[] = [
    {
      key: 'alarms',
      tabLabel: TAB_NAMES.ALARMS,
      renderContent: () => (
        <AlarmsList
          companyId={property?.companyId}
          propertyId={propertyId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'buildings',
      tabLabel: TAB_NAMES.BUILDINGS,
      renderContent: () => (
        <BuildingsList
          companyId={property?.companyId}
          id={propertyId}
          onUpload={onUpload}
        />
      ),
      visible: property?.multiBuilding,
    },
    {
      key: 'callList',
      tabLabel: TAB_NAMES.CALL_LIST,
      renderContent: () => (
        <CallList propertyId={propertyId} companyId={property?.companyId} />
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
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'communityResources',
      tabLabel: TAB_NAMES.COMMUNITY_RESOURCES,
      renderContent: () => (
        <CommunityResourcesList
          propertyId={propertyId}
          type={EmergencyResources.COMMUNITY_RESOURCE}
          global={false}
          industryType={'RESOURCE' as IndustryTypes}
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
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'hazardousMaterials',
      tabLabel: TAB_NAMES.HAZ_MAT,
      renderContent: () => (
        <HazardousMaterialsList
          companyId={property?.companyId}
          propertyId={propertyId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'insurancePolicies',
      tabLabel: TAB_NAMES.INS_POLICIES,
      renderContent: () => (
        <PolicyDetailsList
          companyId={property?.companyId}
          propertyId={propertyId}
          type={PolicyDetailTypes.INSURANCE}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'masterPolicyDetails',
      tabLabel: TAB_NAMES.MASTER_POLICIES,
      renderContent: () => (
        <PolicyDetailsList
          companyId={property?.companyId}
          propertyId={propertyId}
          type={PolicyDetailTypes.MASTER}
          onUpload={onUpload}
        />
      ),
      visible: property?.propertyTypeId === 2, // Condo
    },
    {
      key: 'procedures',
      tabLabel: TAB_NAMES.PROPERTY_PROCEDURES,
      renderContent: () => (
        <ProceduresList
          companyId={property?.companyId}
          propertyId={propertyId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'relocations',
      tabLabel: TAB_NAMES.RELOCATIONS,
      renderContent: () => (
        <RelocationsList
          companyId={property?.companyId}
          propertyId={propertyId}
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'shelterInPlace',
      tabLabel: TAB_NAMES.SHELTER_IN_PLACE,
      renderContent: () => (
        <SheltersList
          companyId={property?.companyId}
          propertyId={propertyId}
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
          onUpload={onUpload}
        />
      ),
      visible: true,
    },
    {
      key: 'team',
      tabLabel: TAB_NAMES.TEAM,
      renderContent: () => (
        <TeamList
          refetch={refetchTeam}
          companyId={property?.companyId}
          propertyId={propertyId}
          team={team}
          loading={loadingTeam}
          permissions={teamPermissions}
        />
      ),
      visible: true,
    },
    {
      key: 'vendorContacts',
      tabLabel: TAB_NAMES.VENDOR_CONTACTS,
      renderContent: () => (
        <CommunityResourcesList
          propertyId={propertyId}
          companyId={property?.companyId}
          type={EmergencyResources.VENDOR}
          industryType={'VENDOR' as IndustryTypes}
          global
        />
      ),
      visible: true,
    },
  ];

  const renderBottom = () => (
    <>
      {statusProperty && (
        <>
          <HeaderItemIconStatus>
            <PropertyStatus status={statusProperty} />
          </HeaderItemIconStatus>
          <HeaderItemText>{statusProperty}</HeaderItemText>
        </>
      )}

      {address && (
        <>
          <HeaderItemDot />
          <HeaderItemIcon name={IconTypes.Location} size={14} color="#8e8fa1" />
          <HeaderItemText
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{width: '70%'}}>
            {`${address?.address}, ${address?.city}, ${address?.state} ${address?.postalcode}`}
          </HeaderItemText>
        </>
      )}
    </>
  );

  const getActions = useCallback(() => {
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
            loading={loading}
            title="Property"
            variant="square"
            name={name as string}
            image={image || propertyIcon}
            icon={<Icon name={IconTypes.Apartment} color="#323234" size={16} />}
            options={getActions()}
            headerBottom={renderBottom()}
            destructiveButtonIndex={1}
            cancelButtonIndex={2}
            fileCount={property?.fileCount}
            companyId={property?.companyId}
            propertyId={propertyId}
          />
        )}
        tabsConfig={loading ? [] : tabsConfig.filter(tab => tab.visible)}
      />
      {editModal && (
        <EditPropertyModal
          closeModal={() => setEditModal(false)}
          propertyId={propertyId}
        />
      )}
    </MainLayout>
  );
};
