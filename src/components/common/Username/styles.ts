import {Text, View} from 'react-native';
import styled from 'styled-components';

export const HintTrigger = styled(View)`
  border: 2px solid #f36d32;
  color: red;
  border-radius: 9px;
  width: 18px;
  height: 18px;
  line-height: 16px;
  padding: 0 4px;
`;

export const TriggerText = styled(Text)`
  font-size: 12px;
  color: #f36d32;
`;
