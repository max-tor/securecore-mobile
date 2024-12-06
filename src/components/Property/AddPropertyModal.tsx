import {yupResolver} from '@hookform/resolvers/yup';
import {useAddCompanyProperties} from '@securecore-new-application/securecore-datacore';
import {CreatePropertyInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {GET_COMPANY_PROPERTIES} from '@securecore-new-application/securecore-datacore/lib/queries';
import {PropertiesOrderInput} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {PropertyForm, PropertySchema} from './PropertyForm';

interface AddPropertyModalProps {
  companyId: number;
  searchParams: PropertiesOrderInput;
  closeModal: () => void;
}

export const AddPropertyModal = ({
  companyId,
  searchParams,
  closeModal,
}: AddPropertyModalProps) => {
  const [addProperties, {loading: addPropertiesLoading}] =
    useAddCompanyProperties();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    defaultValues: {
      multiBuilding: true,
    },
    resolver: yupResolver(PropertySchema),
  });

  const {control, handleSubmit, reset, setValue} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onAddProperties = useCallback(
    async (formData: FieldValues) => {
      try {
        const propertyData = {
          address: {
            address: formData.address,
            city: formData.city,
            postalcode: formData.postalcode,
            state: formData.state,
          },
          multiBuilding: !!formData.multiBuilding,
          name: formData.name,
          propertyTypeId: parseInt(formData.type, 10),
        };
        const updateCompanyData = {
          companyId,
          properties: [propertyData] as CreatePropertyInput[],
        };

        await addProperties({
          variables: {data: updateCompanyData},
          refetchQueries: [
            {
              query: GET_COMPANY_PROPERTIES,
              variables: {
                id: companyId,
                order: {
                  orderBy: searchParams.orderBy,
                  orderByDirection: searchParams.orderByDirection,
                },
              },
            },
          ],
        });
        toast.show({
          title: ToastNotifications.PropertyAdded,
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
    [
      addProperties,
      companyId,
      onCancel,
      searchParams.orderBy,
      searchParams.orderByDirection,
      toast,
    ],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title="Add Property"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={addPropertiesLoading}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onAddProperties)}
            isLoading={addPropertiesLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <PropertyForm
          control={control}
          loading={addPropertiesLoading}
          setValue={setValue}
        />
      </FormProvider>
    </Modal>
  );
};
