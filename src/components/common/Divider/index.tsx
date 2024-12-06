import {
  Divider as NBDivider,
  HStack,
  ITextProps,
  Text,
  View,
} from 'native-base';
import React from 'react';
import {ViewStyle} from 'react-native';

interface Props {
  text: string;
  _viewStyles?: ViewStyle;
  _text?: ITextProps;
}
export const Divider: React.FC<Props> = ({text, _viewStyles, _text = {}}) => (
  <HStack
    alignItems="center"
    w="100%"
    justifyContent="center"
    style={_viewStyles}>
    <NBDivider orientation="horizontal" position="absolute" />
    <View backgroundColor="#fff" pl={4} pr={4}>
      <Text {..._text}>{text}</Text>
    </View>
  </HStack>
);
