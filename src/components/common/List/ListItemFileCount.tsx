import {HStack, Text, View} from 'native-base';
import React from 'react';

import {IconTypes} from '@/components/common/Icon';
import {ListItemActionIcon} from '@/components/common/List/styles';

export interface FileCountProps {
  count?: number;
}
export const ListItemFileCount: React.FC<FileCountProps> = ({count}) => {
  if (!count) {
    return null;
  }

  return (
    <View>
      <HStack justifyContent="center" justifyItems="center">
        <ListItemActionIcon name={IconTypes.Media} size={14} color="#ea5d21" />
        <Text>{count}</Text>
      </HStack>
    </View>
  );
};
