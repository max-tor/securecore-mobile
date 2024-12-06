import {yupResolver} from '@hookform/resolvers/yup';
import {
  UpdateAlarmInput,
  useGetAlarmById,
  useUpdateAlarm,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {AlarmForm, AlarmSchema} from './AlarmForm';

interface EditAlarmModalProps {
  alarmId: number;
  closeModal: () => void;
  onSuccess: () => void;
}

export const EditAlarmModal = ({
  alarmId,
  closeModal,
  onSuccess,
}: EditAlarmModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(AlarmSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateAlarm, {loading: updateLoading}] = useUpdateAlarm();

  const {data, loading} = useGetAlarmById({
    variables: {id: alarmId},
  });
  const alarm = data?.getAlarmById?.alarm;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateAlarm = useCallback(
    async (formData: FieldValues) => {
      const updateAlarmData = {
        id: alarmId,
        ...formData,
      } as UpdateAlarmInput;

      await updateAlarm({
        variables: {
          data: updateAlarmData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.AlarmUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [alarmId, updateAlarm, onSuccess, toast, onCancel],
  );

  useEffect(() => {
    if (alarm) {
      setValue('name', alarm.name);
      setValue('location', alarm.location);
      setValue('type', alarm.type);
      setValue('armingInstructions', alarm.armingInstructions);
      setValue('disarmingInstructions', alarm.disarmingInstructions);
    }
  }, [alarm, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Alarm"
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
            onPress={handleSubmit(onUpdateAlarm)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <AlarmForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
