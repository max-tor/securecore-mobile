import {useGetCommandCenterById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {Divider} from '@/components';
import {HtmlListItem} from '@/components/common/List';

import {Modal} from '../common/Modal';

interface ViewCommandCenterModalProps {
  closeModal: () => void;
  contactId: number;
}

export const ViewCommandCenterModal = ({
  contactId,
  closeModal,
}: ViewCommandCenterModalProps) => {
  const {data, loading} = useGetCommandCenterById({
    variables: {id: contactId},
  });
  const commandCenter = data?.getCommandCenterById?.commandCenter;

  const renderContent = () => (
    <>
      {(commandCenter?.teamFirstLocation ||
        commandCenter?.teamAlternateLocation) && (
        <Divider text="Team Location" />
      )}
      {commandCenter?.teamFirstLocation && (
        <HtmlListItem title="First" html={commandCenter?.teamFirstLocation} />
      )}
      {commandCenter?.teamAlternateLocation && (
        <HtmlListItem
          title="Alternate"
          html={commandCenter?.teamAlternateLocation}
        />
      )}
      {(commandCenter?.residentFirstLocation ||
        commandCenter?.residentAlternateLocation) && (
        <Divider text="Resident Location" />
      )}
      {commandCenter?.residentFirstLocation && (
        <HtmlListItem
          title="First"
          html={commandCenter?.residentFirstLocation}
        />
      )}
      {commandCenter?.residentAlternateLocation && (
        <HtmlListItem
          title="Alternate"
          html={commandCenter?.residentAlternateLocation}
        />
      )}
      {(commandCenter?.emergencyFirstLocation ||
        commandCenter?.emergencyAlternateLocation) && (
        <Divider text="Emergency Location" />
      )}
      {commandCenter?.emergencyFirstLocation && (
        <HtmlListItem
          title="First"
          html={commandCenter?.emergencyFirstLocation}
        />
      )}
      {commandCenter?.emergencyAlternateLocation && (
        <HtmlListItem
          title="Alternate"
          html={commandCenter?.emergencyAlternateLocation}
        />
      )}
      {(commandCenter?.mediaFirstLocation ||
        commandCenter?.mediaAlternateLocation) && (
        <Divider text="Media Location" />
      )}
      {commandCenter?.mediaFirstLocation && (
        <HtmlListItem title="First" html={commandCenter?.mediaFirstLocation} />
      )}
      {commandCenter?.mediaAlternateLocation && (
        <HtmlListItem
          title="Alternate"
          html={commandCenter?.mediaAlternateLocation}
        />
      )}
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={commandCenter?.name}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
