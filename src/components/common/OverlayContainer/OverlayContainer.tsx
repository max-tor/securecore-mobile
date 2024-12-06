import React from 'react';
import {View} from 'react-native';

import {styles} from './styles';

type OverlayContainerProps = {
  behind?: React.ReactNode;
  children: React.ReactNode;
};

export const OverlayContainer: React.FC<OverlayContainerProps> = ({
  behind,
  children,
}) => (
  <View style={styles.container}>
    <View style={styles.center}>
      <View style={styles.behind}>{behind}</View>
      {children}
    </View>
  </View>
);
