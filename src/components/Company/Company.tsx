import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {
  useGetCompany,
  useGetCompanyTeam,
} from '@securecore-new-application/securecore-datacore';
import {TabsConfigItem, TabsScreen} from 'components/common/TabsScreen';
import React, {useCallback, useState} from 'react';

import {TAB_NAMES} from '@/constants/tabs';
import {useCurrentUser} from '@/hooks/useCurrentUser';
import {MainLayout} from '@/layouts';
import {CompanyStackParamList} from '@/navigation/types';

import {Header} from '../common/Header';
import {HeaderItemIcon, HeaderItemText} from '../common/Header/styles';
import {IconTypes} from '../common/Icon';
import {MediaContactsList} from '../MediaContact';
import {ProceduresList} from '../Procedure';
import {PropertiesList} from '../Property/PropertiesList';
import {TeamList} from '../Team';
import {EditCompanyModal} from './EditCompanyModal';

export const Company = () => {
  const {params} =
    useRoute<RouteProp<CompanyStackParamList, 'CompanyScreen'>>();
  const user = useCurrentUser();
  const companyId = params?.id || (user?.companyId as number);
  const {data, loading, refetch} = useGetCompany({variables: {id: companyId}});

  const {
    data: team,
    refetch: refetchTeam,
    loading: loadingTeam,
  } = useGetCompanyTeam({
    variables: {companyId: companyId as number},
  });

  useFocusEffect(
    useCallback(() => {
      refetch?.();
    }, [refetch]),
  );

  const tabsConfig: TabsConfigItem[] = [
    {
      key: 'procedures',
      tabLabel: TAB_NAMES.PROCEDURES,
      renderContent: () => <ProceduresList companyId={companyId} />,
    },
    {
      key: 'properties',
      tabLabel: TAB_NAMES.PROPERTIES,
      renderContent: () => <PropertiesList id={companyId as number} />,
    },
    {
      key: 'team',
      tabLabel: TAB_NAMES.TEAM,
      renderContent: () => (
        <TeamList
          refetch={refetchTeam}
          loading={loadingTeam}
          team={team?.getCompanyTeam.teamMembers}
          permissions={team?.getCompanyTeam.permissions}
          companyId={companyId}
        />
      ),
    },
    {
      key: 'media',
      tabLabel: 'Media',
      renderContent: () => <MediaContactsList companyId={companyId} />,
    },
  ];

  const [editModal, setEditModal] = useState(false);
  const company = data?.getCompany?.company;
  const permissions = data?.getCompany?.permissions;
  const address = company?.address;
  const name = company?.name;
  const image = company?.image;

  const renderBottom = () => (
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

  const getActions = useCallback(() => {
    const actions = [];

    if (permissions?.update) {
      actions.push({
        title: 'Edit',
        action: () => setEditModal(true),
      });
    }

    if (actions.length) {
      actions.push({
        title: 'Cancel',
      });
    }

    return actions;
  }, [permissions?.update]);

  return (
    <MainLayout title="Company Profile">
      <TabsScreen
        initialTabName={TAB_NAMES.PROCEDURES}
        minHeaderHeight={40}
        renderHeader={() => (
          <Header
            loading={loading}
            backButton={false}
            title="Company Profile"
            name={name as string}
            image={image as string}
            options={getActions()}
            destructiveButtonIndex={1}
            cancelButtonIndex={1}
            headerBottom={renderBottom()}
            fileCount={company?.fileCount}
            companyId={companyId}
          />
        )}
        tabsConfig={tabsConfig}
      />

      {editModal && <EditCompanyModal closeModal={() => setEditModal(false)} />}
    </MainLayout>
  );
};
