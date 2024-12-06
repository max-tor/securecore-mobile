import {yupResolver} from '@hookform/resolvers/yup';
import {
  CreateEvacuationInput,
  useCreateEvacuation,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {EvacuationForm, EvacuationSchema} from './EvacuationForm';

interface AddEvacuationModalProps {
  propertyId: number;
  buildingId?: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddEvacuationModal = ({
  propertyId,
  buildingId,
  closeModal,
  onSuccess,
}: AddEvacuationModalProps) => {
  const [createEvacuation, {loading}] = useCreateEvacuation();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(EvacuationSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addEvacuation = useCallback(
    async (formData: FieldValues) => {
      try {
        const evacuationData = {
          ...formData,
          propertyId,
          buildingId,
        } as CreateEvacuationInput;

        await createEvacuation({
          variables: {
            data: evacuationData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.EvacuationAdded,
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
    [propertyId, buildingId, createEvacuation, onSuccess, toast, onCancel],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Evacuation"
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
            onPress={handleSubmit(addEvacuation)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <EvacuationForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
