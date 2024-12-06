import {useActionSheet} from '@expo/react-native-action-sheet';
import {Pressable} from 'native-base';
import React, {ReactNode} from 'react';

export interface ActionSheetOption<T> {
  title: string;
  action?: (item?: T) => void | Promise<void>;
}

interface Props<T> {
  children: ReactNode;
  options: ActionSheetOption<T>[];
  destructiveButtonIndex?: number;
  cancelButtonIndex: number;
}

export function ActionSheet<T>({
  options,
  destructiveButtonIndex,
  cancelButtonIndex,
  children,
}: Props<T>) {
  const {showActionSheetWithOptions} = useActionSheet();

  const onPress = () => {
    showActionSheetWithOptions(
      {
        options: options.map(o => o.title),
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      selectedIndex => {
        if (selectedIndex !== undefined) {
          options[selectedIndex].action?.();
        }
      },
    );
  };

  return <Pressable onPress={onPress}>{children}</Pressable>;
}
