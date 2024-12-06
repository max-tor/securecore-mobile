import {yupResolver} from '@hookform/resolvers/yup';
import {
  CreatePolicyDetailInput,
  useCreatePolicyDetail,
} from '@securecore-new-application/securecore-datacore';
import {PolicyDetailTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {PolicyDetailsForm, PolicyDetailsSchema} from './PolicyDetailsForm';

interface AddPolicyDetailModalProps {
  propertyId: number;
  type: PolicyDetailTypes;
  closeModal: () => void;
  onSuccess: () => void;
}

export const AddPolicyDetailsModal = ({
  propertyId,
  type,
  closeModal,
  onSuccess,
}: AddPolicyDetailModalProps) => {
  const [createPolicyDetail, {loading}] = useCreatePolicyDetail();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(PolicyDetailsSchema),
  });
  const mainTitlePrefix =
    type === PolicyDetailTypes.INSURANCE ? 'Insurance policy' : 'Master Policy';
  const {control, handleSubmit, reset} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addPolicyDetail = useCallback(
    async (formData: FieldValues) => {
      try {
        const {name, procedure, ...profile} = formData;
        const pdData = {
          name,
          procedure,
          propertyId,
          type,
          profile,
        } as CreatePolicyDetailInput;

        await createPolicyDetail({
          variables: {
            data: pdData,
          },
        });

        onSuccess();
        toast.show({
          title: ToastNotifications.PolicyDetailsAdded,
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
    [type, propertyId, createPolicyDetail, onSuccess, toast, onCancel],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={`Add ${mainTitlePrefix}`}
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
            onPress={handleSubmit(addPolicyDetail)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <PolicyDetailsForm control={control} loading={loading} />
      </FormProvider>
    </Modal>
  );
};
