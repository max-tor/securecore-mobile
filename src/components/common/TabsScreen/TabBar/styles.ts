import {StyleSheet} from 'react-native';

import {TABBAR_HEIGHT} from '@/components/common/TabsScreen/TabBar/TabItem';

export const tabScreenStyles = StyleSheet.create({
  label: {
    backgroundColor: 'transparent',
    fontSize: 15,
    fontFamily: 'SF Pro Text',
  },
  container: {
    backgroundColor: '#ECECEC',
  },
  headerContainer: {
    shadowOffset: {width: 0, height: 0},
    elevation: 0,
    shadowColor: 'transparent',
    backgroundColor: '#ECECEC',
  },
  tab: {
    backgroundColor: 'transparent',
  },
});

export const tabItemStyles = StyleSheet.create({
  grow: {
    flex: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    height: TABBAR_HEIGHT,
  },
  label: {
    margin: 4,
    backgroundColor: 'transparent',
  },
});

export const tabBarStyles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingHorizontal: 20,
  },
});
