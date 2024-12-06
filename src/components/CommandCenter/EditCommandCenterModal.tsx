import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetCommandCenterById,
  useUpdateCommandCenter,
} from '@securecore-new-application/securecore-datacore';
import {UpdateCommandCenterInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {CommandCenterForm, CommandCenterSchema} from './CommandCenterForm';

interface EditCommandCenterModalProps {
  commandCenterId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditCommandCenterModal = ({
  commandCenterId,
  closeModal,
  onSuccess,
}: EditCommandCenterModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(CommandCenterSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateContact, {loading: updateLoading}] = useUpdateCommandCenter();

  const {data, loading} = useGetCommandCenterById({
    variables: {id: commandCenterId},
  });
  const commandCenter = data?.getCommandCenterById?.commandCenter;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateCenter = useCallback(
    async (formData: FieldValues) => {
      const updateCenterData = {
        id: commandCenterId,
        ...formData,
      } as UpdateCommandCenterInput;

      await updateContact({
        variables: {
          data: updateCenterData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.CommandCenterUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [commandCenterId, updateContact, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (commandCenter) {
      setValue('name', commandCenter.name);
      setValue('teamFirstLocation', commandCenter.teamFirstLocation);
      setValue('teamAlternateLocation', commandCenter.teamAlternateLocation);
      setValue('residentFirstLocation', commandCenter.residentFirstLocation);
      setValue(
        'residentAlternateLocation',
        commandCenter.residentAlternateLocation,
      );
      setValue('emergencyFirstLocation', commandCenter.emergencyFirstLocation);
      setValue(
        'emergencyAlternateLocation',
        commandCenter.emergencyAlternateLocation,
      );
      setValue('mediaFirstLocation', commandCenter.mediaFirstLocation);
      setValue('mediaAlternateLocation', commandCenter.mediaAlternateLocation);
    }
  }, [data, commandCenter, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Command Center"
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
            onPress={handleSubmit(onUpdateCenter)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <CommandCenterForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
