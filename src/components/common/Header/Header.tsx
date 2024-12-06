import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useHeaderMeasurements} from 'react-native-collapsible-tab-view';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';

import {Variant} from '@/components/common/Header/types';
import {COMPANY_STACK_SCREENS, ROUTES} from '@/constants/routes';
import {HomeScreenNavigationProp} from '@/navigation/types';

import {ActionSheet, ActionSheetOption} from '../../ActionSheet';
import {houseIcon, Icon, IconTypes} from '../Icon';
import {OverlayContainer} from '../OverlayContainer';
import {
  HeaderBackground,
  HeaderBackgroundWrapper,
  HeaderItem,
  HeaderItemBottom,
  HeaderItemBottomLoading,
  HeaderItemDivider,
  HeaderItemHistory,
  HeaderItemIcon,
  HeaderItemIconAction,
  HeaderItemIconBack,
  HeaderItemIconWrapper,
  HeaderItemMedia,
  HeaderItemNavbar,
  HeaderItemPreviewWrapper,
  HeaderItemSubtitle,
  HeaderItemSubtitleLoading,
  HeaderItemTextWhite,
  HeaderItemTitle,
  HeaderItemTop,
  HeaderItemTopPreview,
  HeaderItemTopPreviewLoading,
  HeaderItemTopPreviewRound,
} from './styles';

// eslint-disable-next-line import/no-unresolved, @typescript-eslint/no-var-requires
const HEADER_BACKGROUND = require('../../../../assets/images/header-placeolder.png');

interface HeaderProps<T> {
  image: string;
  icon?: JSX.Element;
  variant?: Variant;
  title: string;
  name: string;
  options: ActionSheetOption<T>[];
  headerBottom?: JSX.Element | null;
  destructiveButtonIndex?: number;
  cancelButtonIndex?: number;
  backButton?: boolean;
  loading?: boolean;
  fileCount?: number;
  companyId?: number;
  propertyId?: number;
  buildingId?: number;
  tenantSpaceId?: number;
}

export function Header<T>({
  image,
  icon,
  title,
  name,
  options,
  headerBottom,
  variant = 'round',
  destructiveButtonIndex,
  cancelButtonIndex,
  backButton = true,
  loading = false,
  fileCount = 0,
  companyId,
  propertyId,
  buildingId,
  tenantSpaceId,
}: HeaderProps<T>) {
  const HEADER_HEIGHT = variant === 'compact' ? 120 : 200;
  const SLIDER_RANGE = 40;

  const {top, height} = useHeaderMeasurements();

  const opacityAnimation = useAnimatedStyle(() => {
    const val = HEADER_HEIGHT - SLIDER_RANGE;

    return {
      opacity: (val - Math.abs(top.value) * 1.8) / val,
      top: (val - Math.abs(top.value) * 30) / val,
    };
  });

  const titleHideOpacity = useAnimatedStyle(() => {
    const val = HEADER_HEIGHT - SLIDER_RANGE;

    return {
      opacity: (val - Math.abs(top.value) * 1.8) / val,
      width: '100%',
    };
  });
  const titleShowOpacity = useAnimatedStyle(() => {
    const val = HEADER_HEIGHT - SLIDER_RANGE;

    return {
      opacity: 1 - (val - Math.abs(top.value) * 1.8) / val,
      width: '100%',
    };
  });
  const slideUpAnimation = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          top.value,
          [0, -(height.value || 0 - SLIDER_RANGE)],
          [0, height.value || 0 - SLIDER_RANGE],
        ),
      },
    ],
  }));

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const renderImage = () => {
    if (loading) {
      return <HeaderItemTopPreviewLoading $variant={variant} />;
    }

    if (variant === 'round') {
      return (
        <HeaderItemTopPreviewRound
          resizeMode="cover"
          source={image ? {uri: image} : houseIcon}
          $variant={variant}
        />
      );
    }

    return (
      <HeaderItemTopPreview
        resizeMode="cover"
        source={image ? {uri: image} : houseIcon}
        $variant={variant}
      />
    );
  };

  const renderName = () => {
    if (loading) {
      return <HeaderItemSubtitleLoading />;
    }

    return <HeaderItemSubtitle>{name}</HeaderItemSubtitle>;
  };

  const renderBottom = () => {
    if (loading) {
      return <HeaderItemBottomLoading />;
    }

    return <HeaderItemBottom>{headerBottom}</HeaderItemBottom>;
  };

  const onAttachmentsOpen = () => {
    navigation.navigate(ROUTES.COMPANY_STACK, {
      screen: COMPANY_STACK_SCREENS.ATTACHMENTS_SCREEN,
      params: {
        companyId,
        propertyId,
        buildingId,
        tenantSpaceId,
        image,
        title: name,
      },
    });
  };

  const isCompact = variant === 'compact';

  return (
    <HeaderBackgroundWrapper $variant={variant}>
      {!isCompact && <HeaderBackground source={HEADER_BACKGROUND} />}
      <Animated.View style={[slideUpAnimation]}>
        <HeaderItemNavbar>
          {backButton && (
            <HeaderItemIconBack
              name={IconTypes.Back}
              size={25}
              color="#000"
              onPress={() => {
                navigation.goBack();
              }}
            />
          )}
          <OverlayContainer
            behind={
              <Animated.View style={[titleHideOpacity]}>
                <HeaderItemTitle>{title}</HeaderItemTitle>
              </Animated.View>
            }>
            <Animated.View style={[titleShowOpacity]}>
              <HeaderItemTitle numberOfLines={1} ellipsizeMode="tail">
                {name}
              </HeaderItemTitle>
            </Animated.View>
          </OverlayContainer>
          {!isCompact && (
            <>
              <HeaderItemHistory>
                <Icon name={IconTypes.History} size={16} color="#fff" />
              </HeaderItemHistory>
              {fileCount > 0 && (
                <TouchableOpacity onPress={onAttachmentsOpen}>
                  <HeaderItemMedia>
                    <HeaderItemIcon
                      name={IconTypes.Media}
                      size={14}
                      color="#fff"
                    />
                    <HeaderItemTextWhite>{fileCount}</HeaderItemTextWhite>
                  </HeaderItemMedia>
                </TouchableOpacity>
              )}
            </>
          )}
        </HeaderItemNavbar>
      </Animated.View>
      <Animated.View style={[opacityAnimation]}>
        <HeaderItem $variant={variant}>
          <HeaderItemTop $variant={variant}>
            <HeaderItemPreviewWrapper>
              {renderImage()}
              {icon && <HeaderItemIconWrapper>{icon}</HeaderItemIconWrapper>}
            </HeaderItemPreviewWrapper>
            {renderName()}
            {!loading && options.length > 0 && (
              <ActionSheet
                options={options}
                destructiveButtonIndex={
                  destructiveButtonIndex || options.length - 2
                }
                cancelButtonIndex={cancelButtonIndex || options.length - 1}>
                <HeaderItemIconAction
                  name={IconTypes.Dots}
                  size={14}
                  color="#8e8fa1"
                />
              </ActionSheet>
            )}
          </HeaderItemTop>
          {headerBottom && <HeaderItemDivider />}
          {renderBottom()}
        </HeaderItem>
      </Animated.View>
    </HeaderBackgroundWrapper>
  );
}
