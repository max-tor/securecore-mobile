import {
  Alert,
  Center,
  CloseIcon,
  Fab,
  HStack,
  IconButton,
  Text,
  useToast,
  VStack,
  WarningIcon,
} from 'native-base';
import React, {useCallback} from 'react';
import Config from 'react-native-config';

import {useAppState} from '@/hooks/useAppState';
import {ToastNotifications} from '@/notifications/toasts';

const showToggle = !!(__DEV__ && Config.SHOW_NETWORK_TOGGLE);

interface ToastAlertOptions {
  id: number;
  status?: string;
  variant: string;
  title: string;
  [key: string]: unknown;
  onClose: (id: number) => void;
}

const ToastAlert = ({
  id,
  status,
  variant,
  title,
  onClose,
  ...rest
}: ToastAlertOptions) => {
  let titleColor;

  switch (variant) {
    case 'solid': {
      titleColor = 'lightText';
      break;
    }
    case 'outline': {
      titleColor = 'darkText';
      break;
    }
    default: {
      titleColor = null;
    }
  }

  return (
    <Alert
      maxWidth="100%"
      alignSelf="center"
      flexDirection="row"
      status={status || 'info'}
      variant={variant}
      {...rest}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack
          flexShrink={1}
          alignItems="center"
          space={0}
          justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
            <Text
              fontSize="md"
              fontWeight="medium"
              flexShrink={1}
              color={titleColor}>
              {title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            icon={<CloseIcon size="3" />}
            _icon={{
              color: variant === 'solid' ? 'lightText' : 'darkText',
            }}
            onPress={() => onClose(id)}
          />
        </HStack>
      </VStack>
    </Alert>
  );
};

export const NetworkIndicator = () => {
  const {isConnected, toggleConnected} = useAppState();
  const toast = useToast();
  const toastIdRef = React.useRef();

  const onFabPress = useCallback(() => {
    if (toastIdRef.current) {
      return;
    }

    toastIdRef.current = toast.show({
      placement: 'top',
      onCloseComplete: () => {
        toastIdRef.current = undefined;
      },
      render: toastId => (
        <ToastAlert
          id={toastId}
          title={ToastNotifications.NetworkIsOffline}
          variant="left-accent"
          status="error"
          onClose={() => {
            toast.closeAll();
          }}
        />
      ),
    });
  }, [toast]);

  return (
    <>
      {showToggle && (
        <Fab
          renderInPortal
          placement="bottom-left"
          size={10}
          mt={5}
          mb={20}
          colorScheme={isConnected ? 'red' : 'green'}
          p={0}
          onPress={toggleConnected}
          icon={
            <Center>
              <WarningIcon color="white" />
            </Center>
          }
        />
      )}
      {isConnected === false && (
        <Fab
          placement="bottom-right"
          size={10}
          mt={5}
          mb={20}
          colorScheme="red"
          onPress={onFabPress}
          p={0}
          icon={
            <Center>
              <WarningIcon color="white" />
            </Center>
          }
        />
      )}
    </>
  );
};
