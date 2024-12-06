import {useGetAlarmById} from '@securecore-new-application/securecore-datacore';
import React from 'react';

import {HtmlView} from '@/components';
import {HtmlListItem} from '@/components/common/List';

import {
  ListItemRowContent,
  ListItemRowData,
  ListItemRowLabel,
} from '../common/List/styles';
import {Modal} from '../common/Modal';

interface ViewAlarmModalProps {
  closeModal: () => void;
  alarmId: number;
}

export const ViewAlarmModal = ({alarmId, closeModal}: ViewAlarmModalProps) => {
  const {data, loading} = useGetAlarmById({
    variables: {id: alarmId},
  });
  const alarm = data?.getAlarmById?.alarm;

  const renderContent = () => (
    <>
      <ListItemRowData col>
        <ListItemRowLabel full>Location:</ListItemRowLabel>
        <ListItemRowContent full>
          <HtmlView
            contentHtml={alarm?.location as string}
            baseStyle={{
              padding: 0,
            }}
          />
        </ListItemRowContent>
      </ListItemRowData>
      {alarm?.armingInstructions && (
        <HtmlListItem
          title="Arming Instructions"
          html={alarm?.armingInstructions as string}
        />
      )}
      {alarm?.disarmingInstructions && (
        <HtmlListItem
          title="Disarming Instructions"
          html={alarm?.disarmingInstructions as string}
        />
      )}
    </>
  );

  return (
    <Modal
      isOpen
      onClose={closeModal}
      title={`${alarm?.name} (${alarm?.type})`}
      loading={loading}>
      {renderContent()}
    </Modal>
  );
};
