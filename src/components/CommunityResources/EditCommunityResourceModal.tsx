import {yupResolver} from '@hookform/resolvers/yup';
import {
  useGetEmergencyResourceById,
  useUpdateEmergencyResource,
} from '@securecore-new-application/securecore-datacore';
import {UpdateEmergencyResourceInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {
  EmergencyResources,
  IndustryTypes,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {
  CommunityResourceForm,
  CommunityResourceSchema,
} from './CommunityResourceForm';

interface EditCommunityResourceModalProps {
  communityResourceId: number;
  closeModal: () => void;
  onSuccess: () => void;
  title: string;
  type: EmergencyResources;
  industryType: IndustryTypes;
}

export const EditCommunityResourceModal = ({
  communityResourceId,
  closeModal,
  onSuccess,
  title,
  type,
  industryType,
}: EditCommunityResourceModalProps) => {
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(CommunityResourceSchema),
    defaultValues: {
      specialNotes: '',
    },
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const [updateEmergencyResource, {loading: updateLoading}] =
    useUpdateEmergencyResource();

  const {data, loading} = useGetEmergencyResourceById({
    variables: {id: communityResourceId},
  });
  const emergencyResource = data?.getEmergencyResourceById?.emergencyResource;

  const isLoading = updateLoading || loading;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateEmergencyResource = useCallback(
    async (formData: FieldValues) => {
      const updateContactData = {
        id: communityResourceId,
        ...formData,
      } as UpdateEmergencyResourceInput;

      await updateEmergencyResource({
        variables: {
          data: updateContactData,
        },
      });

      onSuccess();
      toast.show({
        title:
          type === EmergencyResources.COMMUNITY_RESOURCE
            ? ToastNotifications.CommunityResourceUpdated
            : ToastNotifications.VendorUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [
      communityResourceId,
      updateEmergencyResource,
      onSuccess,
      toast,
      type,
      onCancel,
    ],
  );

  useEffect(() => {
    if (emergencyResource) {
      setValue('name', emergencyResource.name);
      setValue('specialNotes', emergencyResource.specialNotes);
      setValue('phone', emergencyResource.profile?.phone);
      setValue('alternatePhone', emergencyResource.profile?.alternatePhone);
      setValue('email', emergencyResource.profile?.email);
      setValue('address', emergencyResource.address?.address);
      setValue('city', emergencyResource.address?.city);
      setValue('postalcode', emergencyResource.address?.postalcode);
      setValue('state', emergencyResource.address?.state);
      setValue(
        'industries',
        emergencyResource.industries?.map(industry => ({
          id: industry.id,
          name: industry.name,
        })),
      );
    }
  }, [emergencyResource, setValue]);

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={`Edit ${title}`}
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
            onPress={handleSubmit(onUpdateEmergencyResource)}
            isLoading={isLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <CommunityResourceForm
          control={control}
          loading={!!loading}
          setValue={setValue}
          industryType={industryType}
        />
      </FormProvider>
    </Modal>
  );
};
