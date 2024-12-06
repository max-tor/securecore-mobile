import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateHazMat} from '@securecore-new-application/securecore-datacore';
import {CreateHazMatInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {
  HazardousMaterialForm,
  HazardousMaterialSchema,
} from './HazardousMaterialForm';

interface AddHazardousMaterialModalProps {
  propertyId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddHazardousMaterialModal = ({
  propertyId,
  closeModal,
  onSuccess,
}: AddHazardousMaterialModalProps) => {
  const [createHazMat, {loading}] = useCreateHazMat();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(HazardousMaterialSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addHazardousMaterial = useCallback(
    async (formData: FieldValues) => {
      try {
        const hazMatData = {
          ...formData,
          propertyId,
        } as CreateHazMatInput;

        await createHazMat({
          variables: {
            data: hazMatData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.HazMatAdded,
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
    [propertyId, createHazMat, onSuccess, toast, onCancel],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Hazardous Material"
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
            onPress={handleSubmit(addHazardousMaterial)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <HazardousMaterialForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
