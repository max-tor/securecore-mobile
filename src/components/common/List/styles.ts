import {Text} from 'native-base';
import {Image, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';

import {colors} from '@/theme/colors';

import {Icon} from '../Icon';

export const ListItem = styled(TouchableOpacity)<{
  first?: boolean;
  last?: boolean;
}>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  height: 70px;
  background-color: #ffffff;
  border-top-left-radius: ${({first}) => (first ? '12px' : 0)};
  border-top-right-radius: ${({first}) => (first ? '12px' : 0)};
  border-bottom-right-radius: ${({last}) => (last ? '12px' : 0)};
  border-bottom-left-radius: ${({last}) => (last ? '12px' : 0)};
  margin-bottom: ${({last}) => (last ? '12px' : 0)};
  box-shadow: 6px 6px 26px rgba(187, 187, 187, 0.16);
  border-radius: 12px;
  overflow: hidden;
`;
export const ListItemNarrow = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: 10px 16px;
  background-color: #ffffff;
  box-shadow: 6px 6px 26px rgba(187, 187, 187, 0.16);
  border-radius: 12px;
`;
export const GridItem = styled(TouchableOpacity)<{$variant?: string}>`
  width: 48%;
  height: ${props => (props.$variant === 'card' ? 'auto' : ' 130px')};
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 6px 6px 26px rgba(187, 187, 187, 0.16);
  margin-bottom: 15px;
  padding: ${props => (props.$variant === 'card' ? '0' : '12px')};
  overflow: hidden;
`;
export const GridItemAvatar = styled(Image)`
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  border-radius: 8px;
`;

export const GridItemAvatarWrapper = styled(View)`
  width: 32px;
  height: 32px;
  position: relative;
  overflow: visible;
`;

export const GridItemContentTopText = styled(Text)`
  font-size: 15px;
  line-height: 20px;
  font-weight: 600;
  font-family: 'SF Pro Text';
  color: #323234;
  margin-bottom: 10px;
`;

export const GridItemContentBottom = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: auto;
`;

export const ListHeader = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
`;
export const ListHeaderLeft = styled(View)`
  display: flex;
  flex-direction: row;
`;

export const ListHeaderLeftText = styled(Text)`
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  color: #8e8fa1;
  font-family: 'Inter';
  margin-left: 11px;
`;

export const GridViewIconArrow = styled(View)`
  position: absolute;
  top: 6px;
  right: 8px;
  padding: 6px;
`;

export const ListItemActionIcon = styled(Icon)`
  padding: 5px;
`;
export const ListItemIconArrow = styled(View)`
  padding: 10px;
  right: -10px;
  margin-left: auto;
  margin-right: 10px;
`;
export const ListItemIconDots = styled(ListItemIconArrow)`
  margin-left: auto;
  margin-right: 20px;
`;

export const ListItemDivider = styled(View)`
  height: 1px;
  background-color: #e6e6f0;
  margin: 0 16px;
`;
export const ListItemSpacing = styled(View)`
  height: 8px;
`;

export const ListItemHeader = styled(View)`
  flex-direction: row;
  padding: 15px;
  align-items: center;
  justify-content: space-between;
`;

export const ListItemHeaderTitle = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const ListItemHeaderData = styled(Text)`
  font-family: 'SF Pro Display';
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: #8e8fa1;
`;

export const ListItemRowData = styled(View)<{col?: boolean}>`
  flex: 1;
  flex-direction: ${props => (props.col ? 'column' : 'row')};
  padding-bottom: 25px;
`;

export const ListItemRowLabel = styled(Text)<{full?: boolean}>`
  font-family: 'SF Pro Text';
  font-size: 16px;
  line-height: 18px;
  font-weight: 500;
  color: #323234;
  flex: 1;
  width: ${props => (props.full ? '100%' : '40%')};
  padding-right: 10px;
`;

export const ListItemRowContent = styled(Text)<{
  action?: boolean;
  full?: boolean;
}>`
  font-family: 'SF Pro Text';
  flex: 1;
  font-weight: ${({action}) => (action ? 600 : 300)};
  font-size: 16px;
  line-height: 18px;
  color: ${({action}) => (action ? colors.primary['500'] : '#323234')};
  text-align: ${props => (props.full ? 'justify' : 'right')};
  margin-top: ${props => (props.full ? '12px' : '0')};
`;

export const ListItemHeaderTitleText = styled(Text)`
  font-size: 20px;
  letter-spacing: 0.5px;
  line-height: 24px;
  font-weight: 400;
  font-family: 'SF Pro Display';
  color: #323234;
  padding-left: 10px;
`;

export const ListItemAvatarWrapper = styled(View)`
  position: relative;
  overflow: visible;
`;

export const ListItemIconWrapper = styled(View)`
  width: 24px;
  height: 24px;
  background: rgb(246, 246, 250);
  border: 1px solid rgb(255, 255, 255);
  border-radius: 6px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: absolute;
  bottom: -4px;
  right: 6px;
`;

export const GridItemIconWrapper = styled(ListItemIconWrapper)`
  width: 16px;
  height: 16px;
  bottom: 2px;
  right: 2px;
`;

export const ListItemAvatar = styled(Image)`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 8px;
`;

export const ListItemContentTop = styled(View)`
  display: flex;
  flex-direction: row;
`;

export const ListItemContentTopIcon = styled(View)`
  margin-right: 7px;
`;

export const ListItemContentTopText = styled(Text)`
  font-size: 14px;
  line-height: 14px;
  font-weight: 500;
  font-family: 'SF Pro Text';
  color: ${colors.main.black};
  width: 85%;
`;

export const ListItemContentBottom = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
`;

export const ListItemFlex = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const ListItemContentBottomText = styled(Text)`
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  font-family: 'SF Pro Text';
  color: #8e8fa1;
`;

export const ListItemContentBottomDot = styled(View)`
  width: 2px;
  height: 2px;
  margin: 0 4px;
  background-color: #8e8fa1;
  border-radius: 50px;
`;

export const ListItemContentBottomIcon = styled(View)`
  margin-right: 3px;
`;

export const ListItemContentIcon = styled(Icon)`
  display: flex;
  margin-left: 3px;
`;
export const EmptyList = styled(View)`
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 160px;
  border-radius: 12px;
`;
