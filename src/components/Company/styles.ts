import {Button, View} from 'native-base';
import styled from 'styled-components';

export const StyledForm = styled(View)`
  flex: 1;
  background-color: transparent;
`;

export const FloatingButton = styled(Button).attrs({
  alignSelf: 'center',
})`
  position: absolute;
  bottom: 10px;
  height: 40px;
  border-radius: 12px;
  z-index: 500;
  padding: 7px 16px;
  font-family: 'SF Pro Text';
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 18px;
  background-color: #f36d32;
`;
