import {ScrollView} from 'react-native';
import styled from 'styled-components';

import {colors} from '@/theme/colors';

export const HtmlTextAreaView = styled(ScrollView).attrs({
  padding: 0,
})`
  height: 120px;
  border-color: ${colors.gray};
  border-width: 1px;
  border-radius: 4px;
`;
