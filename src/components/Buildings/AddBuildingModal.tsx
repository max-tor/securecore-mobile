import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateBuilding} from '@securecore-new-application/securecore-datacore';
import {GET_BUILDINGS_BY_PROPERTY_ID} from '@securecore-new-application/securecore-datacore/lib/queries';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {PER_PAGE} from '@/constants';
import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {BuildingForm, BuildingSchema} from './BuildingForm';

interface AddBuildingModalProps {
  propertyId: number;
  closeModal: () => void;
}

export const AddBuildingModal = ({
  propertyId,
  closeModal,
}: AddBuildingModalProps) => {
  const [createBuilding, {loading: addBuildingLoading}] = useCreateBuilding();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(BuildingSchema),
  });

  const {control, handleSubmit, reset, setValue} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onAddBuilding = useCallback(
    async (formData: FieldValues) => {
      try {
        const createBuildingData = {
          propertyId,
          name: formData.name,
          address: {
            city: formData.city || '',
            state: formData.state || '',
            address: formData.address || '',
            postalcode: formData.postalcode || '',
          },
        };

        await createBuilding({
          variables: {data: createBuildingData},
          refetchQueries: [
            {
              query: GET_BUILDINGS_BY_PROPERTY_ID,
              variables: {
                propertyId,
                pagination: {
                  limit: PER_PAGE,
                  offset: 0,
                },
              },
            },
          ],
        });
        toast.show({
          title: ToastNotifications.BuildingAdded,
          placement: 'top',
        });

        onCancel();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [createBuilding, onCancel, propertyId, toast],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Building"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={addBuildingLoading}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onAddBuilding)}
            isLoading={addBuildingLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <BuildingForm
          setValue={setValue}
          control={control}
          loading={addBuildingLoading}
        />
      </FormProvider>
    </Modal>
  );
};
