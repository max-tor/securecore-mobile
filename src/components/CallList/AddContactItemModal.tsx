import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateContactItem} from '@securecore-new-application/securecore-datacore';
import {CreateContactItemInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {GET_CONTACT_ITEMS} from '@securecore-new-application/securecore-datacore/lib/queries';
import {
  ContactListParentType,
  User,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {FormControl, useToast} from 'native-base';
import React, {useCallback} from 'react';
import {Controller, FieldValues, FormProvider, useForm} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {userTitles} from '@/constants';
import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {UserAutocomplete} from '../common/UserAutocomplete';
import {StyledForm} from '../Company/styles';
import {ContactItemForm, ContactItemSchema} from './ContactItemForm';

interface AddContactItemModalProps {
  propertyId: number;
  companyId?: number;
  tenantSpaceId?: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddContactItemModal = ({
  companyId,
  propertyId,
  tenantSpaceId,
  closeModal,
  onSuccess,
}: AddContactItemModalProps) => {
  const [createContactItem, {loading}] = useCreateContactItem();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ContactItemSchema),
  });

  const {control, handleSubmit, reset, setValue} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onAddContactItem = useCallback(
    async (formData: FieldValues) => {
      try {
        const contactData = {
          title: formData.title,
          priority: formData.priority as number,
          propertyId,
          tenantSpaceId,
          parentType: 'CALL_LIST' as ContactListParentType,
          profile: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            alternatePhone: formData.alternatePhone,
          },
        } as CreateContactItemInput;

        await createContactItem({
          variables: {
            data: contactData,
          },
          refetchQueries: [
            {
              query: GET_CONTACT_ITEMS,
              variables: {
                propertyId,
                tenantSpaceId,
                parentType: 'CALL_LIST' as ContactListParentType,
              },
            },
          ],
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.CallListItemAdded,
          placement: 'top',
        });

        onCancel();
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [createContactItem, onCancel, onSuccess, propertyId, tenantSpaceId, toast],
  );

  const onSelectUser = useCallback(
    (user: User) => {
      if (user) {
        const {title, profile} = user;

        setValue(
          'title',
          userTitles.find(item => item.key === title)?.label || undefined,
        );
        setValue('firstName', profile?.firstName);
        setValue('lastName', profile?.lastName);
        setValue('phone', profile?.phone);
        setValue('alternatePhone', profile?.alternatePhone);
        setValue('email', profile?.email);
        setValue('usersearch', `${profile?.firstName} ${profile?.lastName}`);
      }
    },
    [setValue],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Contact"
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
            onPress={handleSubmit(onAddContactItem)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <KeyboardAwareScrollView>
          <StyledForm>
            <FormControl>
              <FormControl.Label>
                Select member from your team or add new contact manually
              </FormControl.Label>
              {companyId && (
                <Controller
                  name="usersearch"
                  render={({field}) => (
                    <UserAutocomplete
                      type="text"
                      companyId={companyId}
                      onSelectUser={onSelectUser}
                      {...field}
                    />
                  )}
                />
              )}
            </FormControl>
            <ContactItemForm control={control} loading={loading} />
          </StyledForm>
        </KeyboardAwareScrollView>
      </FormProvider>
    </Modal>
  );
};
