import {Box} from 'native-base';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';

export const DashboardHeaderBg = styled(Image)`
  position: absolute;
  bottom: 0;
  right: 16px;
`;

export const DashboardAvatarProfile = styled(Image)`
  width: 32px;
  height: 32px;
`;

export const DashboardProfileButton = styled(TouchableOpacity)`
  position: absolute;
  left: 16px;
  top: 5px;
  width: 32px;
  height: 32px;
`;

export const DashboardHeaderTitles = styled(View)`
  margin-top: 33px;
  margin-left: 16px;
`;

export const DashboardHeaderTitle = styled(Text)`
  font-size: 24px;
  font-weight: 600;
  font-family: 'SF Pro Display';
  color: #323234;
  margin-bottom: 4px;
`;
export const DashboardHeaderTitleCollapsed = styled(DashboardHeaderTitle)`
  font-size: 17px;
`;

export const DashboardHeaderSubTitle = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  font-family: 'SF Pro Text';
  color: #323234;
  margin-bottom: 24px;
`;

export const DashboardMainContent = styled(View)`
  padding-left: 16px;
  padding-right: 16px;
  flex: 1;
`;

export const DashboardTabs = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const DashboardTabActive = styled(Box)`
  background-color: #f6f6fa;
  border-color: rgba(230, 230, 240, 0.5);
  border-radius: 20px;
  border-width: 1px;
  min-width: 130px;
`;

export const DashboardTabActiveText = styled(Text)`
  font-size: 15px;
  line-height: 18px;
  font-weight: 600;
  font-family: 'SF Pro Text';
  color: #323234;
  padding: 12px;
  text-align: center;
`;

export const DashboardTab = styled(View)`
  margin-left: 8px;
  border-radius: 8px;
  flex-direction: row;
  padding: 11px 8px;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const DashboardTabText = styled(Text)`
  min-width: 130px;
  position: relative;
  font-size: 15px;
  line-height: 18px;
  font-family: 'SF Pro Text';
  color: #323234;
  padding: 12px;
  text-align: center;
`;
