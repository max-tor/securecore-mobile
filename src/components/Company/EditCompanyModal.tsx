import {yupResolver} from '@hookform/resolvers/yup';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  useGetCompany,
  useUpdateCompany,
} from '@securecore-new-application/securecore-datacore';
import {GET_COMPANY} from '@securecore-new-application/securecore-datacore/lib/queries';
import {useToast} from 'native-base';
import React, {useCallback, useEffect} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';

import {useCurrentUser} from '@/hooks/useCurrentUser';
import {CompanyStackParamList} from '@/navigation/types';
import {ToastNotifications} from '@/notifications/toasts';

import {Button, ButtonGroup} from '../common/Button';
import {Modal} from '../common/Modal';
import {CompanyForm, CompanySchema} from './CompanyForm';

interface EditCompanyModalProps {
  closeModal: () => void;
}

export const EditCompanyModal = ({closeModal}: EditCompanyModalProps) => {
  const {params} =
    useRoute<RouteProp<CompanyStackParamList, 'CompanyScreen'>>();
  const user = useCurrentUser();
  const companyId = params?.id || (user?.companyId as number);
  const toast = useToast();
  const methods = useForm<FieldValues>({
    resolver: yupResolver(CompanySchema),
  });
  const {control, handleSubmit, reset, setValue} = methods;
  const {data, loading} = useGetCompany({variables: {id: companyId}});
  const company = data?.getCompany?.company;
  const [updateCompanyInfo, {loading: updateCompanyLoading}] = useUpdateCompany(
    {
      refetchQueries: [GET_COMPANY],
    },
  );
  const isDisabled = updateCompanyLoading || loading;
  const onCancel = useCallback(() => {
    reset();
    closeModal();
  }, [closeModal, reset]);

  const onUpdateCompany = useCallback(
    async (formData: FieldValues) => {
      const updateCompanyData = {
        id: companyId,
        name: formData.name,
        address: {
          id: company?.address.id as number,
          city: formData.city,
          state: formData.state,
          postalcode: formData.postalcode,
          address: formData.address,
        },
      };

      await updateCompanyInfo({
        variables: {
          data: updateCompanyData,
        },
      });

      toast.show({
        title: ToastNotifications.CompanyUpdated,
        placement: 'top',
      });
      onCancel();
    },
    [company?.address.id, companyId, onCancel, toast, updateCompanyInfo],
  );

  useEffect(() => {
    if (company) {
      const {name, address} = company;

      setValue('name', name);
      setValue('city', address?.city);
      setValue('state', address?.state);
      setValue('postalcode', address?.postalcode);
      setValue('address', address?.address);
    }
  }, [company, data, setValue]);

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title="Edit Company"
      footer={
        <ButtonGroup isAttached size="md" my={5}>
          <Button
            variant="outline"
            isDisabled={isDisabled}
            onPress={onCancel}
            w="50%">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit(onUpdateCompany)}
            isLoading={updateCompanyLoading}
            w="50%">
            Save
          </Button>
        </ButtonGroup>
      }>
      <FormProvider {...methods}>
        <CompanyForm
          control={control}
          loading={!!isDisabled}
          setValue={setValue}
        />
      </FormProvider>
    </Modal>
  );
};
