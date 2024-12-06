import {RouteProp, useRoute} from '@react-navigation/native';
import {useGetAttachments} from '@securecore-new-application/securecore-datacore';
import React, {FC, useCallback, useContext, useMemo} from 'react';

import {TabsConfigItem, TabsScreen} from '@/components';
import {AttachmentList} from '@/components/Attachments/AttachmentList';
import {UploadProgressContext} from '@/contexts/uploadProgress';
import {OnUpload, usePickImage} from '@/hooks/usePickImage';
import {MainLayout} from '@/layouts';
import {CompanyStackParamList} from '@/navigation/types';
import {pluralize} from '@/utils/text';

import {Header} from '../common/Header';
import {FloatingButton} from '../Company/styles';

interface Props {
  companyId?: number;
  onUpload?: OnUpload;
}

export const Attachment: FC<Props> = () => {
  const {uploadProgress, setUploadProgress} = useContext(UploadProgressContext);
  const {params} =
    useRoute<RouteProp<CompanyStackParamList, 'AttachmentsScreen'>>();
  const {buildingId, companyId, propertyId, tenantSpaceId, image, title} =
    params;
  const {data, loading, refetch} = useGetAttachments({
    variables: {
      data: {
        buildingId,
        companyId,
        propertyId,
        tenantSpaceId,
      },
    },
  });
  const onSuccess = useCallback(() => refetch?.(), [refetch]);

  const {onSelectImage} = usePickImage({
    onSuccess,
    uploadProgress,
    setUploadProgress,
  });

  const allAttachments = useMemo(
    () => data?.getAttachments ?? [],
    [data?.getAttachments],
  );
  const attachments = useMemo(
    () => ({
      all: allAttachments,
      alarms: allAttachments.filter(item => !!item.alarmId),
      mediaContact: allAttachments.filter(item => !!item.mediaContactId),
      procedure: allAttachments.filter(item => !!item.procedureId),
      property: allAttachments.filter(item => !!item.propertyId),
    }),
    [allAttachments],
  );

  const onUploadFile = useCallback(() => {
    onSelectImage({
      companyId,
      ...(propertyId && {propertyId}),
      ...(buildingId && {buildingId}),
      ...(tenantSpaceId && {tenantSpaceId}),
    });
  }, [buildingId, companyId, onSelectImage, propertyId, tenantSpaceId]);

  if (!data?.getAttachments.length) {
    return null;
  }

  /* eslint-disable indent */
  const tabsConfig: TabsConfigItem[] = [
    {
      key: 'all',
      tabLabel: 'All Files',
      renderContent: () => (
        <AttachmentList attachments={attachments.all} refetch={refetch} />
      ),
    },
    ...(attachments.alarms.length
      ? [
          {
            key: 'alarms',
            tabLabel: 'Alarms',
            renderContent: () => (
              <AttachmentList
                attachments={attachments.alarms}
                refetch={refetch}
              />
            ),
          },
        ]
      : []),
    ...(attachments.mediaContact.length
      ? [
          {
            key: 'mediaContact',
            tabLabel: 'Media Contact',
            renderContent: () => (
              <AttachmentList
                attachments={attachments.mediaContact}
                refetch={refetch}
              />
            ),
          },
        ]
      : []),
    ...(attachments.procedure.length
      ? [
          {
            key: 'procedure',
            tabLabel: 'Procedure',
            renderContent: () => (
              <AttachmentList
                attachments={attachments.procedure}
                refetch={refetch}
              />
            ),
          },
        ]
      : []),
    ...(attachments.property.length
      ? [
          {
            key: 'property',
            tabLabel: 'Property',
            renderContent: () => (
              <AttachmentList
                attachments={attachments.property}
                refetch={refetch}
              />
            ),
          },
        ]
      : []),
  ];
  /* eslint-enable indent */

  const fileCount = attachments.all.length;

  return (
    <MainLayout>
      <FloatingButton onPress={onUploadFile}>+ Upload File</FloatingButton>

      <TabsScreen
        initialTabName={tabsConfig[0].tabLabel}
        minHeaderHeight={40}
        renderHeader={() => (
          <Header
            fileCount={attachments.all.length}
            loading={loading}
            image={image as string}
            title={`${fileCount} ${pluralize(fileCount, 'File')}`}
            name={title as string}
            options={[]}
            variant="compact"
          />
        )}
        tabsConfig={tabsConfig}
      />
    </MainLayout>
  );
};
