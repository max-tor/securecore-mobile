import {yupResolver} from '@hookform/resolvers/yup';
import {
  CreateRelocationInput,
  useCreateRelocation,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {RelocationForm, RelocationSchema} from './RelocationForm';

interface AddRelocationModalProps {
  propertyId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddRelocationModal = ({
  propertyId,
  closeModal,
  onSuccess,
}: AddRelocationModalProps) => {
  const [createRelocation, {loading}] = useCreateRelocation();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(RelocationSchema),
  });

  const {control, handleSubmit, reset, setValue} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addRelocation = useCallback(
    async (formData: FieldValues) => {
      try {
        const relocationData = {
          ...formData,
          propertyId,
        } as CreateRelocationInput;

        await createRelocation({
          variables: {
            data: relocationData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.RelocationAdded,
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
    [propertyId, createRelocation, onSuccess, toast, onCancel],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Relocation"
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
            onPress={handleSubmit(addRelocation)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <RelocationForm
          control={control}
          loading={loading}
          setValue={setValue}
        />
      </FormProvider>
    </Modal>
  );
};
