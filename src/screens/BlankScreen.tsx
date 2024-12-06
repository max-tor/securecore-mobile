import {Button, Text} from 'native-base';
import React, {useContext} from 'react';

import {AuthContext} from '@/contexts/auth';
import {MainLayout} from '@/layouts';

export const BlankScreen = () => {
  const {signOut} = useContext(AuthContext);

  return (
    <MainLayout title="Blank Screen">
      <Text>Blank Screen</Text>
      <Button onPress={signOut}>Log out</Button>
    </MainLayout>
  );
};
