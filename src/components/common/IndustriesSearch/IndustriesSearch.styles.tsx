import {Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components';

import {ListItemDivider} from '@/components/common/List/styles';
import {colors} from '@/theme/colors';

export const ResultsListItem = styled(TouchableOpacity).attrs({})`
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const ResultsListItemDivider = styled(ListItemDivider)`
  margin: 0;
`;
export const Placeholder = styled(Text)`
  font-size: 12px;
  color: ${colors.darkGrey};
`;
