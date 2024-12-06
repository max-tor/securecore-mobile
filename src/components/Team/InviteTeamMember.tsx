import {yupResolver} from '@hookform/resolvers/yup';
import {
  GET_COMPANY_TEAM,
  GET_PROPERTY_TEAM,
  InviteMemberInput,
  useInviteMembers,
} from '@securecore-new-application/securecore-datacore';
import {TeamRoles} from '@securecore-new-application/securecore-datacore/lib/types';
import {FormControl, useToast} from 'native-base';
import React, {useCallback} from 'react';
import {Controller, FieldValues, FormProvider, useForm} from 'react-hook-form';
import * as yup from 'yup';

import {ToastNotifications} from '@/notifications/toasts';

import {userRoles} from '../../constants';
import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {Select, SelectItem} from '../common/Select';
import {TextInput} from '../common/TextInput';

interface InviteTeamMemberProps {
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

export const ProfileSchema = yup
  .object({
    email: yup.string().email().required(),
    role: yup.string().required(),
  })
  .required();

export const InviteTeamMember = ({
  companyId,
  propertyId,
  closeModal,
}: InviteTeamMemberProps) => {
  const [addCompanyMembers, {loading}] = useInviteMembers();
  const toast = useToast();

  const methods = useForm<FieldValues>({
    resolver: yupResolver(ProfileSchema),
  });

  const {control, handleSubmit, reset} = methods;

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
        const addCompanyInput = {
          users: [formData as InviteMemberInput],
          companyId,
          propertyId,
        };
        const query = propertyId ? GET_PROPERTY_TEAM : GET_COMPANY_TEAM;
        const variables = propertyId ? {propertyId} : {companyId};

        await addCompanyMembers({
          variables: {data: addCompanyInput},
          refetchQueries: [{query, variables}],
        });

        toast.show({
          title: ToastNotifications.MemberInvitationSent,
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
    [addCompanyMembers, companyId, onCancel, propertyId, toast],
  );

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title="Invite Team Member"
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
            Invite
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <FormControl>
          <FormControl.Label>Email*</FormControl.Label>
          <Controller
            control={control}
            name="email"
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
      </FormProvider>
    </Modal>
  );
};
