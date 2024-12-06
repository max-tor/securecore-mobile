import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateShelter} from '@securecore-new-application/securecore-datacore';
import {CreateShelterInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {Button, ButtonGroup} from '@/components/common/Button';
import {Modal} from '@/components/common/Modal';
import {ToastNotifications} from '@/notifications/toasts';

import {ShelterForm, ShelterSchema} from './ShelterForm';

interface AddShelterModalProps {
  propertyId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddShelterModal = ({
  propertyId,
  closeModal,
  onSuccess,
}: AddShelterModalProps) => {
  const [createShelter, {loading}] = useCreateShelter();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(ShelterSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addShelter = useCallback(
    async (formData: FieldValues) => {
      try {
        const shelterData = {
          ...formData,
          propertyId,
        } as CreateShelterInput;

        await createShelter({
          variables: {
            data: shelterData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.ShelterAdded,
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
    [propertyId, createShelter, onSuccess, toast, onCancel],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Shelter In Place"
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
            onPress={handleSubmit(addShelter)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <ShelterForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
