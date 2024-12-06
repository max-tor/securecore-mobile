import {useNavigation} from '@react-navigation/native';
import {Button} from 'native-base';
import React from 'react';
import {Alert} from 'react-native';

import {HeaderItemIconBack, HeaderItemNavbar} from '../common/Header/styles';
import {avatar, Icon, IconTypes} from '../common/Icon';
import {
  ProfileAvatar,
  ProfileAvatarImage,
  ProfileAvatarPhoto,
  ProfileAvatarWrapper,
  ProfileHeaderTitle,
  ProfileHeaderWrapper,
} from './styles';

interface HeaderProps {
  image?: string;
  onSave: () => void;
  resetInputs: () => void;
  buttonDisabled: boolean;
}

export function ProfileHeader({
  image,
  onSave,
  buttonDisabled,
  resetInputs,
}: HeaderProps) {
  const navigation = useNavigation();
  const goBack = () => {
    if (buttonDisabled) {
      resetInputs();
      navigation.goBack();

      return;
    }
    Alert.alert('If you exit all changes will not be saved', '', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Exit',
        onPress: () => {
          resetInputs();
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ProfileHeaderWrapper>
      <HeaderItemNavbar>
        <HeaderItemIconBack
          name={IconTypes.Back}
          size={25}
          color="#000"
          onPress={goBack}
        />
        <ProfileHeaderTitle numberOfLines={1} ellipsizeMode="tail">
          Account Info
        </ProfileHeaderTitle>
        <Button
          onPress={onSave}
          variant="secondary"
          size="xs"
          isDisabled={buttonDisabled}>
          Save
        </Button>
      </HeaderItemNavbar>
      <ProfileAvatarWrapper>
        <ProfileAvatar>
          <ProfileAvatarImage source={image ? {uri: image} : avatar} />
          <ProfileAvatarPhoto onPress={() => null}>
            <Icon name={IconTypes.Photo} color="#323234" size={16} />
          </ProfileAvatarPhoto>
        </ProfileAvatar>
      </ProfileAvatarWrapper>
    </ProfileHeaderWrapper>
  );
}
