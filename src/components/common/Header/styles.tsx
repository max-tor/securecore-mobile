import {Skeleton, Text} from 'native-base';
import {Image, View} from 'react-native';
import styled from 'styled-components';

import {isAndroid} from '@/constants/device';

import {Icon} from '../Icon';

export const HeaderItem = styled(View)<{$variant?: string}>`
  background-color: #fff;
  padding: 15px;
  margin: 0 16px;
  box-shadow: 6px 6px 26px rgba(187, 187, 187, 0.16);
  border-radius: 12px;
  height: ${props => (props.$variant === 'compact' ? '72px' : 'auto')};
`;

export const HeaderItemNavbar = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 15px;
  padding: 0 0 15px 0;
  position: relative;
`;
export const HeaderItemMedia = styled(View)`
  display: flex;
  flex-direction: row;
  padding: 8px 10px;
  background: #ea5d21;
  border-radius: 8px;
`;
export const HeaderItemHistory = styled(View)`
  padding: 7px 12px;
  background: #ea5d21;
  border-radius: 8px;
  margin-right: 10px;
`;

export const HeaderItemPreviewWrapper = styled(View)`
  position: relative;
`;

export const HeaderItemIconWrapper = styled(View)`
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
  bottom: 4px;
  left: 4px;
`;

export const HeaderBackgroundWrapper = styled(View)<{$variant?: string}>`
  position: relative;
  display: flex;
  height ${props => (props.$variant === 'compact' ? '72px' : '200px')};
  padding-top: ${isAndroid() ? '10px' : '0'};
`;
export const HeaderBackground = styled(Image)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const HeaderItemTopPreview = styled(Image)<{$variant?: string}>`
  width: ${props => (props.$variant === 'compact' ? '40px' : '56px')};
  height: ${props => (props.$variant === 'compact' ? '40px' : '56px')};
  border-radius: 4px;
  margin-right: 12px;
`;
export const HeaderItemTopPreviewRound = styled(HeaderItemTopPreview)`
  border-radius: 28px;
`;

export const HeaderItemTopPreviewLoading = styled(Skeleton).attrs({
  rounded: 'full',
})<{$variant?: string}>`
  width: ${props => (props.$variant === 'compact' ? '40px' : '56px')};
  height: ${props => (props.$variant === 'compact' ? '40px' : '56px')};
  margin-right: 12px;
`;

export const HeaderItemSubtitle = styled(Text)`
  width: 75%;
  font-size: 17px;
  line-height: 20px;
  font-weight: 600;
  font-family: 'SF Pro Display';
  color: #323234;
  align-self: center;
`;

export const HeaderItemSubtitleLoading = styled(Skeleton).attrs({
  rounded: 'md',
})`
  width: 75%;
  height: 20px;
  color: #323234;
  align-self: center;
  padding: 0;
`;

export const HeaderItemTitle = styled(Text)`
  font-weight: 600;
  font-family: 'SF Pro Display';
  color: #323234;
  font-size: 17px;
  line-height: 17px;
  text-align: center;
  margin-top: 5px;
  margin-left: 40px;
`;

export const HeaderItemTop = styled(View)<{$variant?: string}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${props => (props.$variant === 'compact' ? 0 : '15px')};
  margin-top: ${props => (props.$variant === 'compact' ? 0 : '4px')};
`;

export const HeaderItemDivider = styled(View)`
  height: 1px;
  background-color: #e6e6f0;
`;

export const HeaderItemDot = styled(View)`
  width: 2px;
  height: 2px;
  margin: 0 4px;
  background-color: #8e8fa1;
  border-radius: 50px;
`;

export const HeaderItemIcon = styled(Icon)`
  display: flex;
  margin-right: 4px;
`;
export const HeaderItemIconBack = styled(HeaderItemIcon)`
  padding: 3px;
`;
export const HeaderItemIconStatus = styled(View)`
  margin-right: 4px;
`;
export const HeaderItemIconAction = styled(Icon)`
  padding: 10px;
  right: 10px;
  top: -10px;
`;

export const HeaderItemBottom = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;

export const HeaderItemBottomLoading = styled(Skeleton).attrs({
  rounded: 'md',
})`
  margin-top: 15px;
  height: 14px;
`;

export const HeaderItemText = styled(Text)`
  font-size: 12px;
  line-height: 14px;
  font-weight: 500;
  font-family: 'SF Pro Text';
  color: #8e8fa1;
`;
export const HeaderItemTextWhite = styled(HeaderItemText)`
  color: #fff;
`;
