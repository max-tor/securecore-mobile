import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetBuildingInfo,
  useUpdateBuilding,
} from '@securecore-new-application/securecore-datacore';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {BuildingForm, BuildingSchema} from './BuildingForm';

interface EditBuildingModalProps {
  buildingId: number;
  closeModal: () => void;
}

export const EditBuildingModal = ({
  buildingId,
  closeModal,
}: EditBuildingModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(BuildingSchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateBuilding, {loading: updateLoading}] = useUpdateBuilding();

  const {data, loading} = useGetBuildingInfo({variables: {id: buildingId}});
  const building = data?.getBuildingInfo.building;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateBuilding = useCallback(
    async (formData: FieldValues) => {
      const updateBuildingData = {
        id: buildingId,
        address: {
          city: formData.city,
          state: formData.state,
          postalcode: formData.postalcode,
          address: formData.address,
        },
        name: formData.name,
      };

      await updateBuilding({
        variables: {
          data: updateBuildingData,
        },
      });

      toast.show({
        title: ToastNotifications.BuildingUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [onCancel, buildingId, toast, updateBuilding],
  );

  useEffect(() => {
    if (building) {
      const {name, address} = building;

      setValue('name', name);
      setValue('city', address?.city);
      setValue('state', address?.state);
      setValue('postalcode', address?.postalcode);
      setValue('address', address?.address);
    }
  }, [data, building, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Edit Building"
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
            onPress={handleSubmit(onUpdateBuilding)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <BuildingForm
          setValue={setValue}
          control={control}
          loading={!!loading}
        />
      </FormProvider>
    </Modal>
  );
};
