import {TouchableOpacity} from 'react-native';
import styled from 'styled-components';

import {ListItemDivider} from '@/components/common/List/styles';

export const ResultsListItem = styled(TouchableOpacity).attrs({})`
  padding-top: 12px;
  padding-bottom: 12px;
`;

export const ResultsListItemDivider = styled(ListItemDivider)`
  margin: 0;
`;
