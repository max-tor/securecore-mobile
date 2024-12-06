/* eslint-disable global-require,import/no-unresolved */
import {yupResolver} from '@hookform/resolvers/yup';
import {FormControl} from 'native-base';
import * as React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import * as yup from 'yup';

import {TextInput} from '@/components';
import {StyledAccountForm} from '@/components/AccountForm/styles';
import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';

interface FormData {
  fname: string;
  lname: string;
  userType: string;
  email: string;
}
const schema = yup
  .object({
    fname: yup.string().required('First Name is a required field'),
    lname: yup.string().required('Last Name is a required field'),
    email: yup.string(),
    userType: yup.string(),
  })
  .required();

export const AccountForm = () => {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const {register} = methods;

  return (
    <StyledAccountForm>
      <FormProvider {...methods}>
        <FormControl>
          <FormControl.Label>First Name*</FormControl.Label>
          <TextInput type="text" {...register('fname', {})} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Last Name*</FormControl.Label>
          <TextInput type="text" {...register('lname', {})} />
        </FormControl>
        <FormControl>
          <FormControl.Label>User Type</FormControl.Label>
          <TextInput
            type="text"
            isDisabled
            isReadOnly
            defaultValue="Manager"
            {...register('userType', {})}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput
            InputLeftElement={
              <Icon
                name={IconTypes.Mail}
                color="#9B9EC0"
                size={16}
                style={{marginLeft: 10}}
              />
            }
            type="text"
            isDisabled
            isReadOnly
            defaultValue="leslie@7352huntington.com"
            {...register('email', {})}
          />
        </FormControl>
      </FormProvider>
    </StyledAccountForm>
  );
};
