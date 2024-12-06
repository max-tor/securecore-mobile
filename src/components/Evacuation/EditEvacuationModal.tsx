import {yupResolver} from '@hookform/resolvers/yup';
import {
  UpdateEvacuationInput,
  useGetEvacuationById,
  useUpdateEvacuation,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {EvacuationForm, EvacuationSchema} from './EvacuationForm';

interface EditEvacuationModalProps {
  evacuationId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditEvacuationModal = ({
  evacuationId,
  closeModal,
  onSuccess,
}: EditEvacuationModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(EvacuationSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateEvacuation, {loading: updateLoading}] = useUpdateEvacuation();

  const {data, loading} = useGetEvacuationById({
    variables: {id: evacuationId},
  });
  const evacuation = data?.getEvacuationById?.evacuation;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateEvacuation = useCallback(
    async (formData: FieldValues) => {
      const updateEvacuationData = {
        id: evacuationId,
        ...formData,
      } as UpdateEvacuationInput;

      await updateEvacuation({
        variables: {
          data: updateEvacuationData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.EvacuationUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [evacuationId, updateEvacuation, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (evacuation) {
      setValue('name', evacuation.name);
      setValue('primaryEvacuationRoute', evacuation.primaryEvacuationRoute);
      setValue('procedure', evacuation.procedure);
    }
  }, [evacuation, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Evacuation"
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
            onPress={handleSubmit(onUpdateEvacuation)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <EvacuationForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
