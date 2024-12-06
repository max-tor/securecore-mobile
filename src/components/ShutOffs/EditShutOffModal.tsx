import {yupResolver} from '@hookform/resolvers/yup';
import {
  UpdateShutOffInput,
  useGetShutOffById,
  useUpdateShutOff,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {ShutOffForm, ShutOffSchema} from './ShutOffForm';

interface EditShutOffModalProps {
  shutOffId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditShutOffModal = ({
  shutOffId,
  closeModal,
  onSuccess,
}: EditShutOffModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ShutOffSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateShutOff, {loading: updateLoading}] = useUpdateShutOff();

  const {data, loading} = useGetShutOffById({
    variables: {id: shutOffId},
  });
  const shutOff = data?.getShutOffById?.shutOff;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateShutOff = useCallback(
    async (formData: FieldValues) => {
      const updateShutOffData = {
        id: shutOffId,
        ...formData,
      } as UpdateShutOffInput;

      await updateShutOff({
        variables: {
          data: updateShutOffData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.ShutOffUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [shutOffId, updateShutOff, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (shutOff) {
      setValue('name', shutOff.name);
      setValue('location', shutOff.location);
      setValue('instructions', shutOff.instructions);
    }
  }, [shutOff, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Shut-Off"
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
            onPress={handleSubmit(onUpdateShutOff)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <ShutOffForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
