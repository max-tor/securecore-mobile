import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetPropertyInfo,
  useUpdateProperty,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {PropertyForm, PropertySchema} from './PropertyForm';

interface EditPropertyModalProps {
  propertyId: number;
  closeModal: () => void;
}

export const EditPropertyModal = ({
  propertyId,
  closeModal,
}: EditPropertyModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(PropertySchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateProperty, {loading: updateLoading}] = useUpdateProperty();

  const {data, loading} = useGetPropertyInfo({variables: {id: propertyId}});
  const property = data?.getPropertyInfo?.property;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateProperty = useCallback(
    async (formData: FieldValues) => {
      const updatePropertyData = {
        id: propertyId,
        address: {
          city: formData.city,
          state: formData.state,
          postalcode: formData.postalcode,
          address: formData.address,
        },
        name: formData.name,
        propertyTypeId: parseInt(formData.type, 10),
        multiBuilding: formData.multiBuilding,
      };

      await updateProperty({
        variables: {
          data: updatePropertyData,
        },
      });

      toast.show({
        title: ToastNotifications.PropertyUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [onCancel, propertyId, toast, updateProperty],
  );

  useEffect(() => {
    if (property) {
      const {name, multiBuilding, propertyTypeId, address} = property;

      setValue('name', name);
      setValue('multiBuilding', multiBuilding);
      setValue('type', propertyTypeId);
      setValue('city', address?.city);
      setValue('state', address?.state);
      setValue('postalcode', address?.postalcode);
      setValue('address', address?.address);
    }
  }, [data, property, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Property"
      loading={loading}
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
            onPress={handleSubmit(onUpdateProperty)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <PropertyForm
          control={control}
          loading={!!loading}
          setValue={setValue}
        />
      </FormProvider>
    </Modal>
  );
};
