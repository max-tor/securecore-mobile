import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateMediaContact} from '@securecore-new-application/securecore-datacore';
import {CreateMediaContactInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {GET_MEDIA_CONTACTS} from '@securecore-new-application/securecore-datacore/lib/queries';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {MediaContactForm, MediaContactSchema} from './MediaContactForm';

interface AddMediaContactModalProps {
  companyId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddMediaContactModal = ({
  companyId,
  closeModal,
  onSuccess,
}: AddMediaContactModalProps) => {
  const [createMediaContact, {loading}] = useCreateMediaContact();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(MediaContactSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onAddMediaContact = useCallback(
    async (formData: FieldValues) => {
      try {
        const mediaContactData = {
          ...formData,
          companyId,
        } as CreateMediaContactInput;

        await createMediaContact({
          variables: {
            data: mediaContactData,
          },
          refetchQueries: [
            {
              query: GET_MEDIA_CONTACTS,
              variables: {
                id: companyId,
              },
            },
          ],
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.MediaContactAdded,
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
    [companyId, createMediaContact, onCancel, onSuccess, toast],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Media Contact"
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
            onPress={handleSubmit(onAddMediaContact)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <MediaContactForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
