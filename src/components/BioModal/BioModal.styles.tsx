import {Heading, Modal, Text} from 'native-base';
import {Dimensions} from 'react-native';
import styled from 'styled-components';

const {height} = Dimensions.get('window');

export const ModalContent = styled(Modal.Content)`
  margin-bottom: 0;
  margin-top: auto;
  height: ${height - 100}px;
`;
export const ModalBody = styled(Modal.Body)`
  height: ${height - 100}px;
  justify-content: space-between;
  padding-bottom: 80px;
`;
export const ModalTitle = styled(Heading)`
  margin-top: 50px;
  margin-bottom: 10px;
  font-family: 'SF Pro Display';
  font-size: 24px;
  font-weight: 600;
  line-height: 29px;
  color: #323234;
`;

export const ModalText = styled(Text)`
  width: 250px;
  text-align: center;
  font-family: 'SF Pro Text';
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
`;
