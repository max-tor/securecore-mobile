import {IModalProps, Skeleton, View} from 'native-base';
import React, {FC} from 'react';

import {
  StyledModal,
  StyledModalBody,
  StyledModalCloseButton,
  StyledModalContent,
  StyledModalContentCentered,
  StyledModalHeader,
} from '@/components/common/Modal/styles';

interface Props extends IModalProps {
  title?: string;
  footer?: React.ReactNode;
  center?: boolean;
  loading?: boolean;
}

export const Modal: FC<Props> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  center = false,
  loading = false,
  ...props
}: Props) => {
  const ContentWrapper = center
    ? StyledModalContentCentered
    : StyledModalContent;

  return (
    <StyledModal
      safeAreaTop
      isOpen={isOpen}
      onClose={onClose}
      animationPreset="slide"
      size="full"
      avoidKeyboard
      {...props}>
      <ContentWrapper>
        <StyledModalCloseButton />
        <StyledModalHeader fontSize="lg">
          {title || 'Loading...'}
        </StyledModalHeader>
        <StyledModalBody>
          {loading ? (
            <View>
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
              <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
            </View>
          ) : (
            children
          )}
        </StyledModalBody>
        {footer && <StyledModal.Footer>{footer}</StyledModal.Footer>}
      </ContentWrapper>
    </StyledModal>
  );
};
