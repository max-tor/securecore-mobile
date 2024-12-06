import {Button, Center, Image, Modal} from 'native-base';
import React, {FC, useContext} from 'react';
import {BIOMETRY_TYPE} from 'react-native-keychain';

import {
  ModalBody,
  ModalContent,
  ModalText,
  ModalTitle,
} from '@/components/BioModal/BioModal.styles';
import {AuthContext} from '@/contexts/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const faceIdImage = require('../../../assets/images/face_id.png');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const touchIdImage = require('../../../assets/images/touch_id.png');

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const biometryMapping = {
  [BIOMETRY_TYPE.FACE_ID]: 'Face ID',
  [BIOMETRY_TYPE.FACE]: 'Face ID',
  [BIOMETRY_TYPE.TOUCH_ID]: 'Touch ID',
  [BIOMETRY_TYPE.FINGERPRINT]: BIOMETRY_TYPE.FINGERPRINT,
  [BIOMETRY_TYPE.IRIS]: 'Iris',
};

export const biometryImageMapping = {
  [BIOMETRY_TYPE.FACE_ID]: faceIdImage,
  [BIOMETRY_TYPE.FACE]: faceIdImage,
  [BIOMETRY_TYPE.TOUCH_ID]: touchIdImage,
  [BIOMETRY_TYPE.FINGERPRINT]: touchIdImage,
  [BIOMETRY_TYPE.IRIS]: faceIdImage,
};

export const BioModal: FC<Props> = ({onCancel, isOpen = false, onConfirm}) => {
  const {biometryType: storedBiometryType} = useContext(AuthContext);

  const buttonText = `Enable ${
    biometryMapping[storedBiometryType as BIOMETRY_TYPE]
  }`;

  const image = biometryImageMapping[storedBiometryType as BIOMETRY_TYPE];

  return (
    <Modal isOpen={isOpen} size="full" animationPreset="slide">
      <ModalContent>
        <ModalBody>
          <Center flex={1}>
            {image && <Image source={image} w={137} h={137} />}
            <ModalTitle textAlign="center">
              Log in with {biometryMapping[storedBiometryType as BIOMETRY_TYPE]}
            </ModalTitle>
            <ModalText>
              {' '}
              Do you want to use{' '}
              {biometryMapping[storedBiometryType as BIOMETRY_TYPE]} to sign in
              to SecureCore?
            </ModalText>
          </Center>
          <Button mb={2} onPress={onConfirm} w="100%">
            {buttonText}
          </Button>
          <Button variant="outline" onPress={onCancel} w="100%">
            Cancel
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
