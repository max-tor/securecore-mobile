import {Skeleton, Text, View} from 'native-base';
import * as React from 'react';
import {SectionListData, SectionListRenderItem} from 'react-native';

import {Icon, IconTypes} from '@/components/common/Icon';
import {EmptyList} from '@/components/common/List/styles';
import {SectionList} from '@/components/common/TabsScreen';
import {colors} from '@/theme/colors';

import {ListItemDivider} from './styles';

interface Props<ItemT> {
  renderItem: SectionListRenderItem<ItemT>;
  renderSectionHeader: (info: {
    section: SectionListData<ItemT>;
  }) => React.ReactElement;
  keyExtractor: (item: ItemT) => string;
  sections: ReadonlyArray<SectionListData<ItemT>>;
  loading?: boolean;
  onRefresh?: () => void;
}

export function SectionsList<ItemT>({
  renderItem,
  renderSectionHeader,
  keyExtractor,
  sections,
  loading,
  onRefresh,
}: Props<ItemT>) {
  const itemDivider = loading ? null : () => <ListItemDivider />;

  const renderEmptyContainer = () =>
    !loading ? (
      <EmptyList>
        <Icon name={IconTypes.Warning} size={24} color={colors.darkGrey} />
        <Text color={colors.darkGrey}>No data</Text>
      </EmptyList>
    ) : null;

  const renderLoader = () => (
    <View backgroundColor="red">
      <Skeleton.Text px="20px" mb={5} />
      <Skeleton.Text px="20px" mb={5} />
      <Skeleton.Text px="20px" mb={5} />
    </View>
  );

  const renderListItem = loading ? renderLoader : renderItem;

  return (
    <SectionList<ItemT>
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderListItem}
      onRefresh={onRefresh}
      refreshing={loading}
      renderSectionHeader={renderSectionHeader}
      stickySectionHeadersEnabled={false}
      scrollEnabled
      ItemSeparatorComponent={itemDivider}
      ListEmptyComponent={renderEmptyContainer()}
      contentContainerStyle={{
        padding: 16,
      }}
    />
  );
}
