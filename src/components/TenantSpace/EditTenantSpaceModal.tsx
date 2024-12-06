import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetTenantSpaceInfo,
  useUpdateTenantSpace,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {TenantSpaceForm, TenantSpaceSchema} from './TenantSpaceForm';

interface EditTenantSpaceModalProps {
  tenantSpaceId: number;
  closeModal: () => void;
}

export const EditTenantSpaceModal = ({
  tenantSpaceId,
  closeModal,
}: EditTenantSpaceModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(TenantSpaceSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateTenantSpace, {loading: updateLoading}] = useUpdateTenantSpace();

  const {data, loading} = useGetTenantSpaceInfo({
    variables: {id: tenantSpaceId},
  });
  const tenantSpace = data?.getTenantSpaceInfo?.tenantSpace;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateTenantSpace = useCallback(
    async (formData: FieldValues) => {
      const updateTenantSpaceData = {
        id: tenantSpaceId,
        address: {
          city: formData.city,
          state: formData.state,
          postalcode: formData.postalcode,
          address: formData.address,
        },
        name: formData.name,
        tenantUnit: formData.tenantUnit,
      };

      await updateTenantSpace({
        variables: {
          data: updateTenantSpaceData,
        },
      });

      toast.show({
        title: ToastNotifications.TenantSpaceUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [onCancel, tenantSpaceId, toast, updateTenantSpace],
  );

  useEffect(() => {
    if (tenantSpace) {
      const {name, tenantUnit, address} = tenantSpace;

      setValue('name', name);
      setValue('tenantUnit', tenantUnit);
      setValue('city', address?.city);
      setValue('state', address?.state);
      setValue('postalcode', address?.postalcode);
      setValue('address', address?.address);
    }
  }, [tenantSpace, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Tenant Space"
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
            onPress={handleSubmit(onUpdateTenantSpace)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <TenantSpaceForm
          setValue={setValue}
          control={control}
          loading={!!loading}
        />
      </FormProvider>
    </Modal>
  );
};
