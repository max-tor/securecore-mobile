import {Icon, Pressable} from 'native-base';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {TextInput, TextInputProps} from '../TextInput';

export const PasswordInput: React.FC<TextInputProps> = React.forwardRef(
  (props, ref) => {
    const [show, setShow] = useState<boolean>(false);

    const renderIcon = () => (
      <Pressable onPress={() => setShow(!show)}>
        <Icon
          as={<AntDesign name={show ? 'eye' : 'eyeo'} />}
          size={5}
          mr="2"
          color="muted.400"
        />
      </Pressable>
    );

    return (
      <TextInput
        type={show ? 'text' : 'password'}
        InputRightElement={renderIcon()}
        {...props}
        ref={ref}
      />
    );
  },
);
