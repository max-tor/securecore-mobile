import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetContactItemById,
  useUpdateContactItem,
} from '@securecore-new-application/securecore-datacore';
import {UpdateContactItemInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {StyledForm} from '../Company/styles';
import {ContactItemForm, ContactItemSchema} from './ContactItemForm';

interface EditContactItemModalProps {
  contactId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditContactItemModal = ({
  contactId,
  closeModal,
  onSuccess,
}: EditContactItemModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ContactItemSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateContact, {loading: updateLoading}] = useUpdateContactItem();

  const {data, loading} = useGetContactItemById({
    variables: {id: contactId},
  });
  const contact = data?.getContactItemById?.contactItem;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateContact = useCallback(
    async (formData: FieldValues) => {
      const {title, priority, ...profile} = formData;
      const updateContactData = {
        id: contact?.id,
        title,
        priority: priority as number,
        profile: {
          ...profile,
          id: contact?.profile?.id,
        },
      } as UpdateContactItemInput;

      await updateContact({
        variables: {
          data: updateContactData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.CallListItemUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [
      contact?.id,
      contact?.profile?.id,
      updateContact,
      onSuccess,
      toast,
      onCancel,
    ],
  );

  useEffect(() => {
    if (contact) {
      const {title, profile, priority} = contact;

      setValue('title', title);
      setValue('firstName', profile?.firstName);
      setValue('lastName', profile?.lastName);
      setValue('phone', profile?.phone);
      setValue('alternatePhone', profile?.alternatePhone);
      setValue('email', profile?.email);
      setValue('priority', priority);
    }
  }, [data, contact, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Contact"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={isLoading}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onUpdateContact)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <KeyboardAwareScrollView>
          <StyledForm>
            <ContactItemForm control={control} loading={!!loading} />
          </StyledForm>
        </KeyboardAwareScrollView>
      </FormProvider>
    </Modal>
  );
};
