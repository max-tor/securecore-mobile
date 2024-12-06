import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';

import {isAndroid} from '@/constants/device';

export const ProfileWrapper = styled(ScrollView)`
  padding: 0 16px 21px;
`;

export const ProfileHeaderWrapper = styled(View)`
  padding-top: ${isAndroid() ? '10px' : '0'};
  height: 152px;
`;

export const ProfileHeaderTitle = styled(Text)`
  font-weight: 600;
  font-family: 'SF Pro Display';
  color: #323234;
  font-size: 17px;
  line-height: 17px;
  text-align: center;
  margin-top: 5px;
  margin-left: 20px;
`;

export const ProfileAvatarWrapper = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProfileAvatarImage = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

export const ProfileAvatar = styled(View)`
  position: relative;
`;

export const ProfileAvatarPhoto = styled(TouchableOpacity)`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ProfilePasswordLabel = styled(Text)`
  font-weight: 500;
  font-size: 15px;
  line-height: 20px;
  color: #8e8fa1;
  margin-top: 32px;
  margin-bottom: 8px;
`;

export const ProfilePasswordButton = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 6px 6px 26px rgba(187, 187, 187, 0.16);
  padding: 10px 16px;
  margin-bottom: 42px;
`;
export const ProfilePasswordButtonText = styled(Text)`
  color: #323234;
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
`;
export const ProfilePasswordButtonIcon = styled(View)``;
export const ProfileName = styled(Text)`
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.5px;
  color: #323234;
  text-align: center;
  margin-top: 8px;
`;
export const ProfileRole = styled(Text)`
  font-size: 15px;
  line-height: 20px;
  color: #8e8fa1;
  text-align: center;
`;

export const ProfileMenu = styled(View)`
  margin-top: 24px;
`;
export const ProfileMenuItem = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  padding: 18px 0 18px;
  justify-content: space-between;
`;
export const ProfileMenuText = styled(Text)`
  font-size: 15px;
  line-height: 20px;
  color: #323234;
  padding-left: 13px;
`;
export const ProfileMenuLeft = styled(View)`
  display: flex;
  flex-direction: row;
`;
export const ProfileMenuSeparator = styled(View)`
  width: 100%;
  height: 1px;
  position: relative;
  background-color: #e6e6f0;
`;
