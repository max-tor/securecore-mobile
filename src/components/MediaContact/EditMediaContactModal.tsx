import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetMediaContactById,
  useUpdateMediaContact,
} from '@securecore-new-application/securecore-datacore';
import {UpdateMediaContactInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {MediaContactForm, MediaContactSchema} from './MediaContactForm';

interface EditMediaContactModalProps {
  contactId: number;
  companyId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditMediaContactModal = ({
  contactId,
  companyId,
  closeModal,
  onSuccess,
}: EditMediaContactModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(MediaContactSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateContact, {loading: updateLoading}] = useUpdateMediaContact();

  const {data, loading} = useGetMediaContactById({
    variables: {id: contactId},
  });
  const contact = data?.getMediaContactById?.mediaContact;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateContact = useCallback(
    async (formData: FieldValues) => {
      const updateContactData = {
        id: contactId,
        companyId,
        ...formData,
      } as UpdateMediaContactInput;

      await updateContact({
        variables: {
          data: updateContactData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.MediaContactUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [contactId, companyId, updateContact, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (contact) {
      const {name, profile, procedure} = contact;

      setValue('name', name);
      setValue('firstName', profile?.firstName);
      setValue('lastName', profile?.lastName);
      setValue('phone', profile?.phone);
      setValue('alternatePhone', profile?.alternatePhone);
      setValue('email', profile?.email);
      setValue('procedure', procedure);
    }
  }, [data, contact, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Media Contact"
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
        <MediaContactForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
