import {yupResolver} from '@hookform/resolvers/yup';
import {useCreateEmergencyResource} from '@securecore-new-application/securecore-datacore';
import {CreateEmergencyResourceInput} from '@securecore-new-application/securecore-datacore/lib/mutations';
import {
  EmergencyResources,
  IndustryTypes,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {useToast} from 'native-base';
import React, {useCallback} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {
  CommunityResourceForm,
  CommunityResourceSchema,
} from './CommunityResourceForm';

interface AddCommunityResourceModalProps {
  propertyId: number;
  closeModal: () => void;
  onSuccess: () => void;
  global: boolean;
  type: EmergencyResources;
  title: string;
  industryType: IndustryTypes;
}

export const AddCommunityResourceModal = ({
  propertyId,
  closeModal,
  onSuccess,
  global,
  type,
  title,
  industryType,
}: AddCommunityResourceModalProps) => {
  const [createCommunityResource, {loading}] = useCreateEmergencyResource();
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(CommunityResourceSchema),
    defaultValues: {
      industries: [],
      type,
      global,
    },
  });

  const {control, handleSubmit, reset, setValue} = methods;

  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const addCommunityResource = useCallback(
    async (formData: FieldValues) => {
      try {
        const communityResourceData = {
          ...formData,
          propertyId,
          global: false,
        } as CreateEmergencyResourceInput;

        await createCommunityResource({
          variables: {
            data: communityResourceData,
          },
        });

        onSuccess();
        toast.show({
          title:
            type === EmergencyResources.COMMUNITY_RESOURCE
              ? ToastNotifications.CommunityResourceAdded
              : ToastNotifications.VendorAdded,
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
    [propertyId, createCommunityResource, onSuccess, toast, type, onCancel],
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={`Add ${title}`}
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
            onPress={handleSubmit(addCommunityResource)}
            isLoading={loading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <CommunityResourceForm
          control={control}
          loading={loading}
          setValue={setValue}
          industryType={industryType}
        />
      </FormProvider>
    </Modal>
  );
};
