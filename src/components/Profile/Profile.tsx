import {yupResolver} from '@hookform/resolvers/yup';
import {
  GET_ME,
  useUpdateProfile,
} from '@securecore-new-application/securecore-datacore';
import {FormControl, useToast} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {Controller, FieldValues, FormProvider, useForm} from 'react-hook-form';
import {TouchableOpacity} from 'react-native';
import * as yup from 'yup';

import {TextInput} from '@/components';
import {PHONE_MASK, userTitles} from '@/constants';
import {useCurrentUser} from '@/hooks/useCurrentUser';
import {MainLayout} from '@/layouts';
import {ToastNotifications} from '@/notifications/toasts';

import {ChangePasswordModal} from '../ChangePasswordModal';
import {Icon, IconTypes} from '../common/Icon';
import {MaskedInput} from '../common/MaskedInput';
import {Select, SelectItem} from '../common/Select';
import {ProfileHeader} from './ProfileHeader';
import {
  ProfilePasswordButton,
  ProfilePasswordButtonIcon,
  ProfilePasswordButtonText,
  ProfilePasswordLabel,
  ProfileWrapper,
} from './styles';

export const ProfileSchema = yup
  .object({
    firstName: yup.string().required('First Name is a required field'),
    lastName: yup.string().required('Last Name is a required field'),
    phone: yup.string().nullable(),
    alternatePhone: yup.string().nullable(),
    email: yup.string().email().nullable(),
  })
  .required();

export const Profile = () => {
  const [updateUserInfo, {loading}] = useUpdateProfile();
  const [changePassword, setChangePassword] = useState(false);
  const currentUser = useCurrentUser();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ProfileSchema),
  });
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {isDirty, isSubmitted},
  } = methods;

  const resetInputs = useCallback(() => {
    reset();

    if (!currentUser) {
      return;
    }
    const {profile} = currentUser;

    setValue('title', currentUser.title || '');
    setValue('firstName', profile?.firstName || '');
    setValue('lastName', profile?.lastName || '');
    setValue('image', currentUser?.image || '');
    setValue('phone', profile?.phone || '');
    setValue('alternatePhone', profile?.alternatePhone || '');
    setValue('email', profile?.email || '');
  }, [currentUser, reset, setValue]);

  useEffect(() => {
    resetInputs();
  }, [resetInputs]);

  const updateProfile = useCallback(
    async (formData: FieldValues) => {
      const userData = {
        title: formData.title,
        // image: formData.image,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || null,
          email: formData.email || null,
          alternatePhone: formData.alternatePhone || null,
        },
      };

      await updateUserInfo({
        variables: {data: userData},
        refetchQueries: [{query: GET_ME}],
      });
      toast.show({
        title: ToastNotifications.ProfileUpdated,
        placement: 'top',
      });
    },
    [toast, updateUserInfo],
  );

  useEffect(() => {
    if (currentUser) {
      const {profile} = currentUser;

      setValue('firstName', profile?.firstName);
      setValue('lastName', profile?.lastName);
      setValue('title', currentUser.title);
      setValue('phone', profile?.phone);
      setValue('alternatePhone', profile?.alternatePhone);
      setValue('email', profile?.email);
    }
  }, [currentUser, setValue]);

  return (
    <MainLayout>
      <ProfileHeader
        image={currentUser?.image}
        onSave={handleSubmit(updateProfile)}
        buttonDisabled={!isDirty || isSubmitted}
        resetInputs={resetInputs}
      />
      <ProfileWrapper>
        <FormProvider {...methods}>
          <FormControl>
            <FormControl.Label>First Name*</FormControl.Label>
            <Controller
              control={control}
              name="firstName"
              render={({field}) => (
                <TextInput isDisabled={loading} type="text" {...field} />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Last Name*</FormControl.Label>
            <Controller
              control={control}
              name="lastName"
              render={({field}) => (
                <TextInput isDisabled={loading} type="text" {...field} />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Title</FormControl.Label>
            <Controller
              control={control}
              name="title"
              render={({field: {onChange, value, ...field}}) => (
                <Select
                  isDisabled={loading}
                  onValueChange={(itemValue: string) => {
                    onChange(itemValue);
                  }}
                  {...field}
                  selectedValue={`${value}`}>
                  {userTitles.map(item => (
                    <SelectItem
                      key={`${item.label}-${item.key}`}
                      label={item.label}
                      value={`${item.key}`}
                    />
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Phone</FormControl.Label>
            <Controller
              control={control}
              name="phone"
              render={({field}) => (
                <MaskedInput
                  isDisabled={loading}
                  type="custom"
                  options={{
                    mask: PHONE_MASK,
                  }}
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Alrernate Phone</FormControl.Label>
            <Controller
              control={control}
              name="alternatePhone"
              render={({field}) => (
                <MaskedInput
                  isDisabled={loading}
                  type="custom"
                  options={{
                    mask: PHONE_MASK,
                  }}
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Controller
              control={control}
              name="email"
              render={({field}) => (
                <TextInput isDisabled={loading} type="text" {...field} />
              )}
            />
          </FormControl>
        </FormProvider>
        <ProfilePasswordLabel>Password</ProfilePasswordLabel>
        <TouchableOpacity onPress={() => setChangePassword(true)}>
          <ProfilePasswordButton>
            <ProfilePasswordButtonText>
              Change Password
            </ProfilePasswordButtonText>
            <ProfilePasswordButtonIcon>
              <Icon size={24} color="#E6E6F0" name={IconTypes.Forward} />
            </ProfilePasswordButtonIcon>
          </ProfilePasswordButton>
        </TouchableOpacity>
      </ProfileWrapper>

      {changePassword && (
        <ChangePasswordModal closeModal={() => setChangePassword(false)} />
      )}
    </MainLayout>
  );
};
