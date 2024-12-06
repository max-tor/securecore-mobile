import {Select} from 'native-base';
import styled from 'styled-components';

export const StyledSelect = styled(Select).attrs({
  _selectedItem: {
    bg: '#F36D32',
  },
})`
  background-color: #f6f6fa;
`;
