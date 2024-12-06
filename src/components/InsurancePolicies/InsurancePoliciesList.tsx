import {useGetPolicyDetails} from '@securecore-new-application/securecore-datacore';
import {
  PolicyDetail,
  PolicyDetailTypes,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {List} from 'components/common/List';
import React, {FC, useEffect} from 'react';
import {View} from 'react-native';

import {useIsTabFocused} from '@/components';
import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {
  ListItem,
  ListItemContentTop,
  ListItemContentTopText,
  ListItemIconArrow,
} from '@/components/common/List/styles';
import {TAB_NAMES} from '@/constants/tabs';

interface ListProps {
  propertyId?: number;
  type: PolicyDetailTypes;
}

export const InsurancePoliciesList: FC<ListProps> = ({propertyId, type}) => {
  const {data, loading, refetch} = useGetPolicyDetails({
    variables: {
      data: {
        propertyId,
        type,
      },
    },
  });

  const isTabFocused = useIsTabFocused(TAB_NAMES.INS_POLICIES);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const evacuationList =
    (data?.getPolicyDetails.policyDetails as PolicyDetail[]) || [];

  const renderItem = ({item, index}: {item: PolicyDetail; index?: number}) => (
    <ListItem
      first={index === 0}
      last={(index || 0) + 1 === evacuationList?.length}>
      <View>
        <ListItemContentTop>
          <ListItemContentTopText>{item.name}</ListItemContentTopText>
        </ListItemContentTop>
      </View>
      <ListItemIconArrow>
        <Icon name={IconTypes.Dots} color="#8E8FA1" size={16} />
      </ListItemIconArrow>
    </ListItem>
  );

  return (
    <List<PolicyDetail>
      onRefresh={() => {
        refetch?.();
      }}
      data={evacuationList}
      loading={loading}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
    />
  );
};
