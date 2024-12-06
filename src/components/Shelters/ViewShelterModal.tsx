import {useGetShelterById} from '@securecore-new-application/securecore-datacore';
import {Skeleton, View} from 'native-base';
import React from 'react';

import {HtmlListItem} from '@/components/common/List';
import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '@/components/common/List/styles';
import {Modal} from '@/components/common/Modal';

interface ViewShelterModalProps {
  closeModal: () => void;
  shelterId: number;
}

export const ViewShelterModal = ({
  shelterId,
  closeModal,
}: ViewShelterModalProps) => {
  const {data, loading} = useGetShelterById({
    variables: {id: shelterId},
  });
  const shelter = data?.getShelterById?.shelter;

  const renderContent = () => {
    if (!shelter) {
      return (
        <View>
          <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
          <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
          <Skeleton.Text lines={1} px="18px" mb={15} p={0} />
        </View>
      );
    }

    return (
      <>
        <ListItemRowData>
          <ListItemRowLabel>Type:</ListItemRowLabel>
          <ListItemRowContent>{shelter.type}</ListItemRowContent>
        </ListItemRowData>
        {shelter?.procedure && (
          <HtmlListItem title="Procedure" html={shelter?.procedure} />
        )}
      </>
    );
  };

  return (
    <Modal isOpen onClose={closeModal} title={shelter?.name} loading={loading}>
      {renderContent()}
    </Modal>
  );
};
