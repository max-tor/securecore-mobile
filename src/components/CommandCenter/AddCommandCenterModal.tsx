import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateCommandCenter} from '@securecore-new-application/securecore-datacore';
import {CreateCommandCenterInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {GET_COMMAND_CENTERS} from '@securecore-new-application/securecore-datacore/lib/queries';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {CommandCenterForm, CommandCenterSchema} from './CommandCenterForm';

interface AddCommandCenterModalProps {
  propertyId: number;
  buildingId?: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddCommandCenterModal = ({
  propertyId,
  buildingId,
  closeModal,
  onSuccess,
}: AddCommandCenterModalProps) => {
  const [createCommandCenter, {loading}] = useCreateCommandCenter();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(CommandCenterSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onAddCommandCenter = useCallback(
    async (formData: FieldValues) => {
      try {
        const commandCenterData = {
          ...formData,
          propertyId,
          buildingId,
        } as CreateCommandCenterInput;

        await createCommandCenter({
          variables: {
            data: commandCenterData,
          },
          refetchQueries: [
            {
              query: GET_COMMAND_CENTERS,
              variables: {
                propertyId,
                buildingId,
              },
            },
          ],
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.CommandCenterAdded,
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
    [buildingId, createCommandCenter, onCancel, onSuccess, propertyId, toast],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Command Center"
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
            onPress={handleSubmit(onAddCommandCenter)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <CommandCenterForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
