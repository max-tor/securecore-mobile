import {yupResolver} from '@hookform/resolvers/yup';
import {
  CreateShutOffInput,
  useCreateShutOff,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {ShutOffForm, ShutOffSchema} from './ShutOffForm';

interface AddShutOffModalProps {
  propertyId: number;
  buildingId?: number;
  tenantSpaceId?: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddShutOffModal = ({
  propertyId,
  buildingId,
  tenantSpaceId,
  closeModal,
  onSuccess,
}: AddShutOffModalProps) => {
  const [createShutOff, {loading}] = useCreateShutOff();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ShutOffSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addShutOff = useCallback(
    async (formData: FieldValues) => {
      try {
        const relocationData = {
          ...formData,
          propertyId,
          buildingId,
          tenantSpaceId,
        } as CreateShutOffInput;

        await createShutOff({
          variables: {
            data: relocationData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.ShutOffAdded,
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
    [
      propertyId,
      buildingId,
      tenantSpaceId,
      createShutOff,
      onSuccess,
      toast,
      onCancel,
    ],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Shut-Off"
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
            onPress={handleSubmit(addShutOff)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <ShutOffForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
