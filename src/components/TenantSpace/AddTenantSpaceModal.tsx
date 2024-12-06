import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateTenantSpace} from '@securecore-new-application/securecore-datacore';
import {GET_TENANT_SPACES_BY_BUILDING_ID} from '@securecore-new-application/securecore-datacore/lib/queries';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {PER_PAGE} from '@/constants';
import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {TenantSpaceForm, TenantSpaceSchema} from './TenantSpaceForm';

interface AddTenantSpaceModalProps {
  buildingId: number;
  closeModal: () => void;
}

export const AddTenantSpaceModal = ({
  buildingId,
  closeModal,
}: AddTenantSpaceModalProps) => {
  const [createTenantSpace, {loading: addTenantSpaceLoading}] =
    useCreateTenantSpace();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(TenantSpaceSchema),
  });

  const {control, handleSubmit, reset, setValue} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onAddTenantSpace = useCallback(
    async (formData: FieldValues) => {
      try {
        const createTenantSpaceData = {
          buildingId,
          name: formData.name,
          tenantUnit: formData.tenantUnit,
          address: {
            city: formData.city || '',
            state: formData.state || '',
            address: formData.address || '',
            postalcode: formData.postalcode || '',
          },
        };

        await createTenantSpace({
          variables: {data: createTenantSpaceData},
          refetchQueries: [
            {
              query: GET_TENANT_SPACES_BY_BUILDING_ID,
              variables: {buildingId, pagination: {limit: PER_PAGE, offset: 0}},
            },
          ],
        });

        toast.show({
          title: ToastNotifications.TenantSpaceAdded,
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
    [createTenantSpace, onCancel, buildingId, toast],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Tenant Space"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={addTenantSpaceLoading}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onAddTenantSpace)}
            isLoading={addTenantSpaceLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <TenantSpaceForm
          setValue={setValue}
          control={control}
          loading={addTenantSpaceLoading}
        />
      </FormProvider>
    </Modal>
  );
};
