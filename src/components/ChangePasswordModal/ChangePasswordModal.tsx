import {yupResolver} from '@hookform/resolvers/yup';
import Clipboard from '@react-native-clipboard/clipboard';
import {useChangeUserPassword} from '@securecore-new-application/securecore-datacore';
import {FormControl, useToast} from 'native-base';
import React, {useCallback} from 'react';
import {Controller, FieldValues, FormProvider, useForm} from 'react-hook-form';
import {Linking} from 'react-native';
import Config from 'react-native-config';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import {passwordRegex} from '@/constants';
import {useCurrentUser} from '@/hooks/useCurrentUser';
import {ToastNotifications} from '@/notifications/toasts';

import {PasswordInput} from '../common';
import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {StyledForm} from '../Company/styles';
import {ForgotLinkText, ForgotLinkWrapper} from './ChangePasswordModal.styles';

const PASSWORD_POLICY_ERROR =
  'Password should contain minimum 8 characters and at least 1 upper case, 1 lower case and 1 number.';

interface Props {
  userId?: number;
  closeModal: () => void;
}

enum FormFields {
  currentPassword = 'currentPassword',
  password = 'password',
  confirmPassword = 'confirmPassword',
}

export const ChangePasswordSchema = yup.object({
  currentPassword: yup.string().when('userId', {
    is: false,
    then: yup.string().required('This field is required!'),
  }),
  password: yup
    .string()
    .required('This field is required!')
    .test({
      name: 'pattern',
      test(value, ctx) {
        if (value && !passwordRegex.test(value)) {
          return ctx.createError({
            message: PASSWORD_POLICY_ERROR,
          });
        }

        return true;
      },
    }),
  confirmPassword: yup
    .string()
    .required('This field is required!')
    .test({
      name: 'pattern',
      test(value, ctx) {
        if (value && !passwordRegex.test(value)) {
          return ctx.createError({
            message: PASSWORD_POLICY_ERROR,
          });
        }

        return true;
      },
    })
    .test({
      name: 'passwords-match',
      test(value, ctx) {
        if (this.parent.password !== value) {
          return ctx.createError({
            message: 'Passwords must match.',
          });
        }

        return true;
      },
    }),
});

export function ChangePasswordModal({closeModal, userId}: Props) {
  const appUrl = Config.APP_URL;
  const currentUser = useCurrentUser();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues: {
      userId: Boolean(userId),
    },
  });
  const {control, handleSubmit, reset} = methods;
  const [changeUserPassword, {loading}] = useChangeUserPassword();
  const toast = useToast();

  const handleCloseModal = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const changePassword = useCallback(
    async (formData: FieldValues) => {
      try {
        const changePasswordInput = {
          password: formData.password,
          currentPassword: formData.currentPassword,
          userId,
        };

        await changeUserPassword({
          variables: {data: changePasswordInput},
        });

        toast.show({
          title: ToastNotifications.PasswordChangeCopied,
          placement: 'top',
        });
        Clipboard.setString(formData.password);
        handleCloseModal();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [changeUserPassword, handleCloseModal, toast, userId],
  );

  const forgotClick = useCallback(async () => {
    if (!currentUser?.profile?.email) {
      toast.show({
        title: ToastNotifications.PasswordForgotAlert,
        placement: 'top',
      });

      return;
    }

    await Linking.openURL(`${appUrl}/auth/forgot`);
  }, [appUrl, currentUser?.profile?.email, toast]);

  return (
    <Modal
      title="Change password"
      onClose={handleCloseModal}
      isOpen
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={loading}
            onPress={handleCloseModal}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(changePassword)}
            isLoading={loading}
            w="50%">
            Change
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <KeyboardAwareScrollView>
          <StyledForm>
            {!userId && (
              <FormControl>
                <FormControl.Label>Current Password*</FormControl.Label>
                <Controller
                  control={control}
                  name={FormFields.currentPassword}
                  render={({field}) => <PasswordInput {...field} />}
                />
                <ForgotLinkWrapper onPress={forgotClick}>
                  <ForgotLinkText>Forgot password?</ForgotLinkText>
                </ForgotLinkWrapper>
              </FormControl>
            )}
            <FormControl>
              <FormControl.Label>New Password*</FormControl.Label>
              <Controller
                control={control}
                name={FormFields.password}
                render={({field}) => (
                  <PasswordInput isDisabled={loading} {...field} />
                )}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Confirm Password*</FormControl.Label>
              <Controller
                control={control}
                name={FormFields.confirmPassword}
                render={({field}) => (
                  <PasswordInput isDisabled={loading} {...field} />
                )}
              />
            </FormControl>
          </StyledForm>
        </KeyboardAwareScrollView>
      </FormProvider>
    </Modal>
  );
}
