import {FlatList} from 'components/common/TabsScreen';
import {Skeleton, Text, View} from 'native-base';
import React, {useMemo} from 'react';

import {colors} from '@/theme/colors';

import {Icon, IconTypes} from '../Icon';
import {DataLayout} from '../ViewSwitcher/ViewSwitcher';
import {EmptyList, ListItemDivider, ListItemSpacing} from './styles';

interface Props<ItemT> {
  data?: ItemT[];
  headerDate?: string;
  renderItem: React.FC<{item: ItemT; index?: number}>;
  keyExtractor: (item: ItemT) => string;
  renderHeader?: () => React.ReactElement;
  view?: DataLayout;
  type?: 'default' | 'narrow';
  loading?: boolean;
  onRefresh?: () => void;
  onEndReached?: (info: {distanceFromEnd: number}) => void;
}

export function List<ItemT>({
  data,
  renderItem,
  keyExtractor,
  renderHeader,
  view = 'list',
  type,
  loading,
  onRefresh,
  onEndReached,
}: Props<ItemT>) {
  const itemDivider = loading ? null : () => <ListItemDivider />;
  const itemSpacing = loading ? null : () => <ListItemSpacing />;

  const renderLoader = () => (
    <View>
      <Skeleton.Text px="20px" mb={5} p={0} />
      <Skeleton.Text px="20px" mb={5} p={0} />
      <Skeleton.Text px="20px" mb={5} p={0} />
    </View>
  );

  const renderListItem = loading ? renderLoader : renderItem;
  const renderEmptyContainer = () =>
    !loading ? (
      <EmptyList>
        <Icon name={IconTypes.Warning} size={24} color={colors.darkGrey} />
        <Text color={colors.darkGrey}>No data</Text>
      </EmptyList>
    ) : (
      renderLoader()
    );

  const isRefreshing = useMemo(() => {
    if (!data?.length) {
      return false;
    }

    return Boolean(loading);
  }, [data, loading]);

  if (type === 'narrow') {
    return (
      <FlatList
        ListHeaderComponent={renderHeader && renderHeader()}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderListItem}
        ItemSeparatorComponent={itemSpacing}
        ListEmptyComponent={renderEmptyContainer}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        contentContainerStyle={{
          padding: 16,
          backgroundColor: '#ECECEC',
        }}
        onEndReached={onEndReached}
      />
    );
  }

  return (
    <FlatList
      ListHeaderComponent={renderHeader && renderHeader()}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderListItem}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      ItemSeparatorComponent={view === 'list' ? itemDivider : null}
      numColumns={view === 'list' ? 1 : 2}
      contentContainerStyle={{
        padding: 16,
        backgroundColor: '#ECECEC',
      }}
      columnWrapperStyle={
        view === 'list' ? null : {justifyContent: 'space-between'}
      }
      ListEmptyComponent={renderEmptyContainer()}
      onEndReached={onEndReached}
    />
  );
}
