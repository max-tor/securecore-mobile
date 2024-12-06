import {yupResolver} from '@hookform/resolvers/yup';
import {
  CreateAlarmInput,
  useCreateAlarm,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {AlarmForm, AlarmSchema} from './AlarmForm';

interface AddAlarmModalProps {
  propertyId: number;
  buildingId: number;
  tenantSpaceId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddAlarmModal = ({
  propertyId,
  buildingId,
  tenantSpaceId,
  closeModal,
  onSuccess,
}: AddAlarmModalProps) => {
  const [createAlarm, {loading}] = useCreateAlarm();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(AlarmSchema),
  });

  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addAlarm = useCallback(
    async (formData: FieldValues) => {
      try {
        const alarmData = {
          ...formData,
          propertyId,
          buildingId,
          tenantSpaceId,
        } as CreateAlarmInput;

        await createAlarm({
          variables: {
            data: alarmData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.AlarmAdded,
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
    [
      propertyId,
      buildingId,
      tenantSpaceId,
      createAlarm,
      onSuccess,
      toast,
      onCancel,
    ],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Alarm"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={loading}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button onPress={handleSubmit(addAlarm)} isLoading={loading} w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <AlarmForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
