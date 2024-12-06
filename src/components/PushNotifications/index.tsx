import messaging from '@react-native-firebase/messaging';
import {useUpdateDeviceToken} from '@securecore-new-application/securecore-datacore';
import {FC, useCallback, useEffect} from 'react';

import {getFullDeviceName} from '@/constants/device';

const requestUserPermission = async (): Promise<boolean> => {
  const authorizationStatus = await messaging().requestPermission();

  return authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED;
};

export const PushNotifications: FC = (): JSX.Element | null => {
  const [updateDeviceTokenMutation] = useUpdateDeviceToken();

  const updateDeviceToken = useCallback(
    async (deviceToken: string) => {
      try {
        const deviceName = await getFullDeviceName();

        await updateDeviceTokenMutation({
          variables: {
            data: {
              deviceName,
              deviceToken,
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    [updateDeviceTokenMutation],
  );

  const setupNotifications = useCallback(async (): Promise<void> => {
    const enabled = await requestUserPermission();

    if (!enabled) {
      return;
    }

    const token = await messaging().getToken();

    if (!token) {
      return;
    }

    await updateDeviceToken(token);
  }, [updateDeviceToken]);

  useEffect(() => {
    setupNotifications().then();
  }, [setupNotifications]);

  return null;
};
