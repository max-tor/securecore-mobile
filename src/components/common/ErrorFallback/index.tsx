import {Center, Heading, VStack, WarningIcon} from 'native-base';
import React, {FC} from 'react';

const ErrorFallback: FC = (): JSX.Element => (
  <VStack bg="red.400" height="100%">
    <Center flex={1} px="3">
      <WarningIcon color="white" size={45} />
      <Heading color="white" pt={10}>
        Oops... an error occurred.
      </Heading>
    </Center>
  </VStack>
);

export default ErrorFallback;
