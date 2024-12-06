import {Heading, View} from 'native-base';
import {SafeAreaView} from 'react-native';
import styled from 'styled-components';

export const StyledMainPageContainer = styled(SafeAreaView).attrs({
  flex: 1,
  width: '100%',
  padding: 0,
})`
  background-color: #f7f7fa;
`;

export const StyledGuestPageContainer = styled(View).attrs({
  position: 'absolute',
  bottom: 0,
  flex: 1,
  width: '100%',
  letterSpacing: 1,
  background: '#FFFFFF',
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: 6,
  minHeight: 430,
})``;

export const StyledHeader = styled(Heading).attrs({
  position: 'relative',
  fontSize: 32,
  lineHeight: 38,
  fontWeight: '600',
  fontFamily: 'SF Pro Display',
  color: '#323234',
  textAlign: 'left',
})``;

export const StyledSubHeader = styled(Heading).attrs({
  position: 'relative',
  fontSize: 15,
  lineHeight: 20,
  fontFamily: 'SF Pro Text',
  fontStyle: 'normal',
  fontWeight: 400,
  color: 'main.black',
  marginTop: 4,
})``;
