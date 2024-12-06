import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateTeamMember} from '@securecore-new-application/securecore-datacore';
import {CompleteUserInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {
  GET_COMPANY_TEAM,
  GET_PROPERTY_TEAM,
} from '@securecore-new-application/securecore-datacore/lib/queries';
import {TeamRoles} from '@securecore-new-application/securecore-datacore/lib/types';
import {FormControl, useToast} from 'native-base';
import React, {useCallback} from 'react';
import {Controller, FieldValues, FormProvider, useForm} from 'react-hook-form';
import * as yup from 'yup';

import {ToastNotifications} from '@/notifications/toasts';

import {
  passwordRegex,
  PHONE_MASK,
  userNameRegexp,
  userRoles,
  userTitles,
} from '../../constants';
import {PasswordInput} from '../common';
import {Button, ButtonGroup} from '../common/Button';
import {MaskedInput} from '../common/MaskedInput';
import {Modal} from '../common/Modal';
import {Select, SelectItem} from '../common/Select';
import {TextInput} from '../common/TextInput';
import {Username} from '../common/Username';

interface CreateTeamMemberProps {
  companyId?: number;
  propertyId?: number;
  closeModal: () => void;
}

export interface ProfileFormInputs {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  image?: string;
  role: TeamRoles;
  phone: string;
  alternatePhone: string;
  title: string;
}

interface NewTeamMember
  extends Omit<CompleteUserInput, 'userId' | 'invitationHash'> {
  role: TeamRoles;
}

export const ProfileSchema = yup
  .object({
    email: yup.string().email(),
    firstName: yup.string().required('First Name is a required field'),
    lastName: yup.string().required('Last Name is a required field'),
    password: yup
      .string()
      .required('Password is a required field')
      .test({
        name: 'pattern',
        test(value, ctx) {
          if (value && !passwordRegex.test(value)) {
            return ctx.createError({
              message:
                'Password should contain minimum 8 characters and at least 1 upper case, 1 lower case and 1 number.',
            });
          }

          return true;
        },
      }),
    userName: yup
      .string()
      .min(4)
      .max(20)
      .test({
        name: 'pattern',
        test(value, ctx) {
          if (value && !userNameRegexp.test(value)) {
            return ctx.createError({message: 'Incorrect username.'});
          }

          return true;
        },
      })
      .required('Username is a required field'),
    role: yup.string(),
    phone: yup.string(),
    alternatePhone: yup.string(),
    title: yup.string(),
  })
  .required();

export const CreateTeamMember = ({
  companyId,
  propertyId,
  closeModal,
}: CreateTeamMemberProps) => {
  const [createCompanyMember, {loading}] = useCreateTeamMember();
  const toast = useToast();

  const methods = useForm<FieldValues>({
    resolver: yupResolver(ProfileSchema),
  });

  const {control, handleSubmit, reset, setError, clearErrors} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onCreeateMember = useCallback(
    async (formData: FieldValues) => {
      if (!companyId) {
        return null;
      }

      try {
        await createCompanyMember({
          variables: {
            data: {
              companyId,
              propertyId,
              user: formData as NewTeamMember,
            },
          },
          refetchQueries: [
            ...(propertyId
              ? [{query: GET_PROPERTY_TEAM, variables: {propertyId}}]
              : [{query: GET_COMPANY_TEAM, variables: {companyId}}]),
          ],
        });
        toast.show({
          title: ToastNotifications.MemberAdded,
          placement: 'top',
        });

        onCancel();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [companyId, createCompanyMember, onCancel, propertyId, toast],
  );

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title="Create Team Member"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={loading}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onCreeateMember)}
            isLoading={loading}
            w="50%">
            Create
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <Username
          control={control}
          loading={loading}
          setError={setError}
          clearErrors={clearErrors}
        />

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
          <FormControl.Label>Role*</FormControl.Label>
          <Controller
            control={control}
            name="role"
            render={({field: {onChange, value, ...field}}) => (
              <Select
                {...field}
                isDisabled={loading}
                onValueChange={(itemValue: string) => {
                  onChange(itemValue);
                }}
                selectedValue={`${value}`}>
                {userRoles.map(item => (
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
          <FormControl.Label>Title</FormControl.Label>
          <Controller
            control={control}
            name="title"
            render={({field: {onChange, value, ...field}}) => (
              <Select
                {...field}
                isDisabled={loading}
                onValueChange={(itemValue: string) => {
                  onChange(itemValue);
                }}
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
          <FormControl.Label>Alternate Phone</FormControl.Label>
          <Controller
            control={control}
            name="alternatePhone"
            render={({field}) => (
              <MaskedInput
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
        <FormControl>
          <FormControl.Label>Password*</FormControl.Label>
          <Controller
            control={control}
            name="password"
            render={({field}) => (
              <PasswordInput isDisabled={loading} {...field} />
            )}
          />
        </FormControl>
      </FormProvider>
    </Modal>
  );
};
