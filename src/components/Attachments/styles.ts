import {Modal, Skeleton} from 'native-base';
import {Text, View} from 'react-native';
import ReactVideo from 'react-native-video';
import styled from 'styled-components';

import {IconTypes} from '@/components/common/Icon';
import Icon from '@/components/common/Icon/Icon';

export const AttachmentsHeaderTitle = styled(Text)`
  font-weight: 600;
  font-family: 'SF Pro Display';
  color: #323234;
  font-size: 17px;
  line-height: 17px;
  text-align: center;
  margin-top: 5px;
  margin-left: 20px;
  flex: 1;
`;

export const StyledModalCloseButton = styled(Modal.CloseButton)`
  background-color: #f6f6fa;
  border-radius: 50px;
`;

export const HeaderItemTopPreviewLoading = styled(Skeleton).attrs({
  rounded: 'md',
})`
  width: 40px;
  height: 40px;
  margin-right: 12px;
`;

export const HeaderItemSubtitle = styled(Text).attrs({
  numberOfLines: 1,
  ellipsizeMode: 'tail',
})`
  width: 75%;
  font-size: 17px;
  line-height: 20px;
  font-weight: 600;
  font-family: 'SF Pro Display';
  color: #323234;
  align-self: center;
`;

export const HeaderItemTop = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledDotsIcon = styled(Icon).attrs(({theme}) => {
  const {colors, space, sizes, radii} = theme;

  return {
    name: IconTypes.Dots,
    color: colors.main.black,
    size: space['2.5'],
    backgroundColor: colors.custom['Medium Grey'],
    padding: space['2'],
    borderRadius: radii.md,
    width: sizes[6],
    height: sizes[6],
    overflow: 'hidden',
  };
})``;

export const StyledVideo = styled(ReactVideo).attrs({
  paused: true,
  controls: false,
})`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;
