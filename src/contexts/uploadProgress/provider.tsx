import React, {FC, useMemo, useState} from 'react';

import type {UploadProgress} from '@/contexts/uploadProgress/types';

import {UploadProgressContext} from './context';

interface UserProviderProps {
  children: React.ReactNode;
}

export const UploadProgressProvider: FC<UserProviderProps> = ({children}) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  const value = useMemo(
    () => ({
      uploadProgress,
      setUploadProgress,
    }),
    [uploadProgress],
  );

  return (
    <UploadProgressContext.Provider value={value}>
      {children}
    </UploadProgressContext.Provider>
  );
};
