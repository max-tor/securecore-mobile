import React, {useCallback, useEffect} from 'react';
import {View} from 'react-native';

import {useIsTabFocused} from '@/components';
import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {loadFromStorage, saveToStorage} from '@/helpers/asyncStorage';

import {LayoutEntityName} from './types';

export type DataLayout = 'list' | 'grid';
interface ViewSwitcherProps {
  setView(arg0: DataLayout): void;
  layout?: DataLayout;
  entity: LayoutEntityName;
}

export const ViewSwitcher = ({layout, setView, entity}: ViewSwitcherProps) => {
  const isTabFocused = useIsTabFocused(entity);

  useEffect(() => {
    if (!entity) return;
    const getScreenLayout = async () => {
      const listLayout = await loadFromStorage(entity);

      if (!listLayout) return;
      setView(listLayout);
    };

    getScreenLayout();
  }, [entity, isTabFocused, setView]);

  const toggleView = useCallback(
    async (view: DataLayout) => {
      if (entity) {
        await saveToStorage(view, entity);
        setView(view);
      }
    },
    [entity, setView],
  );

  return (
    <View>
      {layout === 'list' ? (
        <Icon
          name={IconTypes.List}
          color="#F36D32"
          size={20}
          onPress={() => toggleView('grid')}
        />
      ) : (
        <Icon
          name={IconTypes.Grid}
          color="#F36D32"
          size={20}
          onPress={() => toggleView('list')}
        />
      )}
    </View>
  );
};
