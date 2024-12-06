import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetHazMatById,
  useUpdateHazMat,
} from '@securecore-new-application/securecore-datacore';
import {UpdateHazMatInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {
  HazardousMaterialForm,
  HazardousMaterialSchema,
} from './HazardousMaterialForm';

interface EditHazardousMaterialModalProps {
  hazMatId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditHazardousMaterialModal = ({
  hazMatId,
  closeModal,
  onSuccess,
}: EditHazardousMaterialModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(HazardousMaterialSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateHazMat, {loading: updateLoading}] = useUpdateHazMat();

  const {data, loading} = useGetHazMatById({
    variables: {id: hazMatId},
  });
  const hazMat = data?.getHazMatById?.hazMat;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateHazMat = useCallback(
    async (formData: FieldValues) => {
      const updateContactData = {
        id: hazMatId,
        ...formData,
      } as UpdateHazMatInput;

      await updateHazMat({
        variables: {
          data: updateContactData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.HazMatUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [hazMatId, updateHazMat, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (hazMat) {
      setValue('name', hazMat.name);
      setValue('location', hazMat.location);
      setValue('quantity', hazMat.quantity);
      setValue('specialNotes', hazMat.specialNotes);
    }
  }, [hazMat, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Hazardous Material"
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
            onPress={handleSubmit(onUpdateHazMat)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <HazardousMaterialForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
