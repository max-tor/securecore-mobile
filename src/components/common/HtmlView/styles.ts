import {View} from 'native-base';
import {ScrollView} from 'react-native';
import styled from 'styled-components';

export const ImageWrapper = styled(View)`
  border-radius: 9px;
  overflow: hidden;
`;

export const ContentWrapper = styled(ScrollView)`
  flex: 1;
  align-self: stretch;
  width: 100%;
  flex-grow: 1;
`;
