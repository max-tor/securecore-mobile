/* eslint-disable global-require */
import {Image, StatusBar} from 'native-base';
import React from 'react';
import {Dimensions, ImageSourcePropType} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  StyledGuestPageContainer,
  StyledHeader,
  StyledSubHeader,
} from '@/layouts/styles';

export const GuestLayout = ({
  children,
  bgImage = require('../../assets/images/layouts/login_background.png'),
  title,
  subtitle,
}: {
  children: React.ReactNode;
  bgImage?: ImageSourcePropType;
  title?: string;
  subtitle?: string;
}): JSX.Element => (
  <>
    <StatusBar
      translucent
      backgroundColor="transparent"
      // barStyle="light-content"
    />
    <KeyboardAwareScrollView
      contentContainerStyle={{width: '100%', height: '100%'}}>
      <Image
        alt=""
        source={bgImage}
        style={{
          width: Dimensions.get('window').width,
          height: 'auto',
          aspectRatio: 375 / 500,
          position: 'absolute',
        }}
      />
      <StyledGuestPageContainer>
        {title && <StyledHeader>{title}</StyledHeader>}
        {subtitle && <StyledSubHeader>{subtitle}</StyledSubHeader>}
        {children}
      </StyledGuestPageContainer>
    </KeyboardAwareScrollView>
  </>
);
