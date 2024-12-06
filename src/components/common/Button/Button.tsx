import {Button as NBButton, IButtonProps} from 'native-base';
import React from 'react';

export const ButtonGroup = NBButton.Group;
export const Button: React.FC<IButtonProps> = ({...props}) => (
  <NBButton size="lg" {...props} />
);
