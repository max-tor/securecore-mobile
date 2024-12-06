import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetAttachmentById,
  useUpdateAttachment,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {AttachmentForm, PropertySchema} from './AttachmentForm';

interface EditPropertyModalProps {
  attachmentId: number;
  closeModal: () => void;
}

export const EditAttachmentModal = ({
  attachmentId,
  closeModal,
}: EditPropertyModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(PropertySchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateAttachment, {loading: updateLoading}] = useUpdateAttachment();

  const {data, loading} = useGetAttachmentById({variables: {id: attachmentId}});

  const attachment = data?.getAttachmentById;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateProperty = useCallback(
    async (formData: FieldValues) => {
      await updateAttachment({
        variables: {
          data: {
            id: attachmentId,
            name: formData.name,
          },
        },
      });

      toast.show({
        title: ToastNotifications.AttachmentUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [attachmentId, onCancel, toast, updateAttachment],
  );

  useEffect(() => {
    if (attachment) {
      setValue('name', attachment.name);
    }
  }, [attachment, data, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Attachment"
      loading={loading}
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
            onPress={handleSubmit(onUpdateProperty)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <AttachmentForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
