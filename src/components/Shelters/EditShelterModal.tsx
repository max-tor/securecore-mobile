import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetShelterById,
  useUpdateShelter,
} from '@securecore-new-application/securecore-datacore';
import {UpdateShelterInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {Button, ButtonGroup} from '@/components/common/Button';
import {Modal} from '@/components/common/Modal';
import {ToastNotifications} from '@/notifications/toasts';

import {ShelterForm, ShelterSchema} from './ShelterForm';

interface EditShelterModalProps {
  shelterId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditShelterModal = ({
  shelterId,
  closeModal,
  onSuccess,
}: EditShelterModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ShelterSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateShelter, {loading: updateLoading}] = useUpdateShelter();

  const {data, loading} = useGetShelterById({
    variables: {id: shelterId},
  });
  const shelter = data?.getShelterById?.shelter;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateShelter = useCallback(
    async (formData: FieldValues) => {
      const updateShelterData = {
        id: shelterId,
        ...formData,
      } as UpdateShelterInput;

      await updateShelter({
        variables: {
          data: updateShelterData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.ShelterUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [shelterId, updateShelter, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (shelter) {
      setValue('name', shelter.name);
      setValue('type', shelter.type);
      setValue('procedure', shelter.procedure);
    }
  }, [shelter, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Shelter In Place"
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
            onPress={handleSubmit(onUpdateShelter)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <ShelterForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
