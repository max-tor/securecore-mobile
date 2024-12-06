import {useToast, View} from 'native-base';
import React, {useCallback} from 'react';
import {Linking, TouchableOpacity} from 'react-native';

import {ToastNotifications} from '@/notifications/toasts';

interface ActionLinkProps {
  link: string;
  type: 'phone' | 'email' | 'browser';
  children: React.ReactNode;
}

export const ActionLink: React.FC<ActionLinkProps> = ({
  link,
  type,
  children,
}) => {
  const toast = useToast();
  const onPress = useCallback(async () => {
    let actionPrefix: string;

    switch (type) {
      case 'email': {
        actionPrefix = 'mailto:';
        break;
      }
      case 'phone': {
        actionPrefix = 'tel://';
        break;
      }
      default: {
        actionPrefix = '';
        break;
      }
    }
    try {
      await Linking.openURL(`${actionPrefix}${link}`);
    } catch (e) {
      toast.show({
        title: ToastNotifications.ActionFailure,
        placement: 'top',
      });
    }
  }, [link, toast, type]);

  if (!link) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  const Wrapper = link ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} style={{flex: 1}}>
      {children}
    </Wrapper>
  );
};
