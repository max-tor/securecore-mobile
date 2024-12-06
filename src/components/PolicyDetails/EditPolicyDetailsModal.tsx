import {yupResolver} from '@hookform/resolvers/yup';
import {
  UpdatePolicyDetailInput,
  useGetPolicyDetailById,
  useUpdatePolicyDetail,
} from '@securecore-new-application/securecore-datacore';
import {PolicyDetailTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {PolicyDetailsForm, PolicyDetailsSchema} from './PolicyDetailsForm';

interface EditPolicyDetailsModalProps {
  policyDetailsId: number;
  closeModal: () => void;
  onSuccess: () => void;
  type: PolicyDetailTypes;
}

export const EditPolicyDetailsModal = ({
  policyDetailsId,
  closeModal,
  onSuccess,
  type,
}: EditPolicyDetailsModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(PolicyDetailsSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updatePolicyDetail, {loading: updateLoading}] =
    useUpdatePolicyDetail();

  const {data, loading} = useGetPolicyDetailById({
    variables: {id: policyDetailsId},
  });
  const policyDetail = data?.getPolicyDetailById?.policyDetail;

  const isLoading = updateLoading || loading;

  const mainTitlePrefix =
    type === PolicyDetailTypes.INSURANCE ? 'Insurance policy' : 'Master Policy';

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdatePolicyDetails = useCallback(
    async (formData: FieldValues) => {
      const {name, procedure, ...profile} = formData;
      const pdData = {
        id: policyDetailsId,
        name,
        procedure,
        profile: {
          id: policyDetail?.profile?.id,
          ...profile,
        },
      } as UpdatePolicyDetailInput;

      await updatePolicyDetail({
        variables: {
          data: pdData,
        },
      });

      onSuccess();
      toast.show({
        title: ToastNotifications.PolicyDetailsUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [
      policyDetailsId,
      policyDetail?.profile?.id,
      updatePolicyDetail,
      onSuccess,
      toast,
      onCancel,
    ],
  );

  useEffect(() => {
    if (policyDetail) {
      const {name, profile, procedure} = policyDetail;

      setValue('name', name);
      setValue('firstName', profile?.firstName);
      setValue('lastName', profile?.lastName);
      setValue('phone', profile?.phone);
      setValue('email', profile?.email);
      setValue('procedure', procedure);
    }
  }, [data, policyDetail, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={`Edit ${mainTitlePrefix}`}
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
            onPress={handleSubmit(onUpdatePolicyDetails)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <PolicyDetailsForm control={control} loading={!!loading} />
      </FormProvider>
    </Modal>
  );
};
