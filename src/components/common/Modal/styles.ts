import {Modal} from 'native-base';
import styled from 'styled-components';

export const StyledModal = styled(Modal)`
  width: 100%;
`;
export const StyledModalContent = styled(Modal.Content)`
  margin-bottom: 0;
  margin-top: auto;
  width: 100%;
  background-color: #fff;
  border-radius: 16px;
`;

export const StyledModalContentCentered = styled(StyledModalContent)`
  margin-bottom: auto;
  margin-top: auto;
`;
export const StyledModalBody = styled(Modal.Body)`
  justify-content: space-between;
  padding-bottom: 20px;
  padding-top: 20px;
`;
export const StyledModalHeader = styled(Modal.Header)`
  font-size: 29px;
  font-weight: 600;
`;
export const StyledModalCloseButton = styled(Modal.CloseButton)`
  background-color: #f6f6fa;
  border-radius: 50px;
`;
