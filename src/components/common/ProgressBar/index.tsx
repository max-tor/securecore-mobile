import {Box, Flex, Progress, usePropsResolution, VStack} from 'native-base';
import type {InterfaceToastProps} from 'native-base/lib/typescript/components/composites/Toast/types';
import React, {useContext, useState} from 'react';

import {UploadProgressContext} from '@/contexts/uploadProgress';

export interface Props extends InterfaceToastProps {
  uploadId: string;
}
export const ProgressBar: React.FC<Props> = ({
  uploadId,
  title = 'Progress',
  _title,
  _description,
  ...rest
}) => {
  const [themeProps] = useState(usePropsResolution('Toast', {}));
  const {uploadProgress} = useContext(UploadProgressContext);

  return (
    <Flex w="90%" maxW="90%" minW={200}>
      <VStack {...themeProps} {...rest}>
        <Box _text={{...themeProps._title, ..._title}}>{title}</Box>
        {uploadProgress[uploadId] !== undefined && (
          <Progress
            value={uploadProgress[uploadId]}
            w="100%"
            size="xs"
            mt={1}
          />
        )}
      </VStack>
    </Flex>
  );
};
