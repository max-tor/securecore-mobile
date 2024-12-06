import {createContext} from 'react';

import {UploadProgressContextInterface} from './types';

export const UploadProgressContext =
  createContext<UploadProgressContextInterface>(
    {} as UploadProgressContextInterface,
  );
