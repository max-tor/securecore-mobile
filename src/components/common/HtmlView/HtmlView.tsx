import React, {useCallback, useState} from 'react';
import {Linking, useWindowDimensions, ViewProps} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
  InternalRendererProps,
  MixedStyleDeclaration,
  TBlock,
  useInternalRenderer,
} from 'react-native-render-html';

import {
  ContentWrapper,
  ImageWrapper,
} from '@/components/common/HtmlView/styles';
import {
  StyledModal,
  StyledModalCloseButton,
  StyledModalContentCentered,
} from '@/components/common/Modal/styles';
import {colors} from '@/theme/colors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const videoImage = require('../../../../assets/images/video.png');

function CustomImageRenderer(props: InternalRendererProps<TBlock>) {
  const {width} = useWindowDimensions();
  const {Renderer, rendererProps} = useInternalRenderer('img', props);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onPress = () => setIsModalOpen(true);
  const onModalClose = () => setIsModalOpen(false);

  const imageWidth = width / 3 - 10;

  return (
    <ImageWrapper>
      <Renderer
        {...rendererProps}
        onPress={onPress}
        style={{width: imageWidth, height: imageWidth}}
        objectFit="cover"
      />
      <StyledModal isOpen={isModalOpen} animationPreset="slide" size="full">
        <StyledModalContentCentered style={{padding: 24, paddingTop: 54}}>
          <StyledModalCloseButton onPress={onModalClose} />
          <Renderer
            {...rendererProps}
            style={{width: width - 48, borderRadius: 12, overflow: 'hidden'}}
          />
        </StyledModalContentCentered>
      </StyledModal>
    </ImageWrapper>
  );
}

function CustomVideoRenderer(props: InternalRendererProps<TBlock>) {
  const {width} = useWindowDimensions();
  const {Renderer, rendererProps} = useInternalRenderer('img', props);
  const imageWidth = width / 3 - 20;

  const onPress = useCallback(async () => {
    const {
      tnode: {
        domNode: {attribs},
      },
    } = props;

    if (attribs.src) {
      try {
        await Linking.openURL(attribs.src);
      } catch (e) {
        console.log(e);
      }
    }
  }, [props]);

  return (
    <ImageWrapper>
      <Renderer
        {...rendererProps}
        source={videoImage}
        onPress={onPress}
        style={{
          width: imageWidth,
          height: imageWidth,
          backgroundColor: 'rgb(50, 50, 52)',
          padding: 5,
        }}
        objectFit="contain"
      />
    </ImageWrapper>
  );
}

export interface HtmlViewProps extends ViewProps {
  contentHtml: string;
  baseStyle?: MixedStyleDeclaration;
}

const renderers = {
  img: CustomImageRenderer,
  video: CustomVideoRenderer,
};

const customHTMLElementModels = {
  video: HTMLElementModel.fromCustomModel({
    tagName: 'video',
    contentModel: HTMLContentModel.mixed,
  }),
};

export const HtmlView: React.FC<HtmlViewProps> = ({
  contentHtml,
  baseStyle,
  ...rest
}) => {
  const {width} = useWindowDimensions();

  return (
    <ContentWrapper {...rest}>
      <RenderHtml
        customHTMLElementModels={customHTMLElementModels}
        baseStyle={{
          padding: 10,
          flexGrow: 1,
          flex: 1,
          alignSelf: 'stretch',
          ...baseStyle,
        }}
        renderers={renderers}
        enableCSSInlineProcessing
        contentWidth={width}
        tagsStyles={{
          a: {
            color: colors.primary[500],
            textDecorationColor: colors.primary[500],
          },
        }}
        classesStyles={{
          'image-item-wrapper': {
            borderRadius: 8,
          },
          'image-item-row': {
            flex: 1,
            flexDirection: 'row',
            marginBottom: 10,
          },
          'image-item': {
            marginRight: 5,
          },
        }}
        source={{
          html: contentHtml,
        }}
      />
    </ContentWrapper>
  );
};
