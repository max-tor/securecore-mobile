import {yupResolver} from '@hookform/resolvers/yup';
import {
  UpdateRelocationInput,
  useGetRelocationById,
  useUpdateRelocation,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {RelocationForm, RelocationSchema} from './RelocationForm';

interface EditRelocationModalProps {
  relocationId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditRelocationModal = ({
  relocationId,
  closeModal,
  onSuccess,
}: EditRelocationModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(RelocationSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateRelocation, {loading: updateLoading}] = useUpdateRelocation();

  const {data, loading} = useGetRelocationById({
    variables: {id: relocationId},
  });
  const relocation = data?.getRelocationById?.relocation;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateRelocation = useCallback(
    async (formData: FieldValues) => {
      const updateRelocationData = {
        id: relocationId,
        ...formData,
      } as UpdateRelocationInput;

      await updateRelocation({
        variables: {
          data: updateRelocationData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.RelocationUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [relocationId, updateRelocation, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (relocation) {
      setValue('name', relocation.name);
      setValue('location', relocation.location);
      setValue('pointOfContactName', relocation.pointOfContactName);
      setValue('pointOfContactTitle', relocation.pointOfContactTitle);
      setValue('pointOfContactPhone', relocation.pointOfContactPhone);
      setValue('specialNotes', relocation.specialNotes);
    }
  }, [relocation, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Relocation"
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
            onPress={handleSubmit(onUpdateRelocation)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <RelocationForm
          control={control}
          loading={!!loading}
          setValue={setValue}
        />
      </FormProvider>
    </Modal>
  );
};
