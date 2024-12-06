import {useGetFaqs} from '@securecore-new-application/securecore-datacore';
import {Faq} from '@securecore-new-application/securecore-datacore/lib/types';
import {Flex} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';

import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';
import {List} from '@/components/common/List';
import {
  ListItemContentTop,
  ListItemContentTopText,
  ListItemNarrow,
} from '@/components/common/List/styles';
import {useIsTabFocused} from '@/components/common/TabsScreen';
import {ViewFaqModal} from '@/components/Faq/ViewFaqModal';
import {TAB_NAMES} from '@/constants/tabs';

export const FaqList = () => {
  const [faqId, setFaqId] = useState<number | null>(null);
  const [viewModal, setViewModal] = useState<boolean>(false);
  const {data, loading, refetch} = useGetFaqs({});

  useEffect(() => {
    refetch?.();
  }, [refetch]);

  const faqs = data?.getFaqs.faqs || [];

  const isTabFocused = useIsTabFocused(TAB_NAMES.FAQ);

  useEffect(() => {
    if (isTabFocused) {
      refetch?.();
    }
  }, [isTabFocused, refetch]);

  const openView = useCallback((id: number) => {
    setViewModal(true);
    setFaqId(id);
  }, []);

  const onModalClose = useCallback(() => {
    setViewModal(false);
  }, []);

  const renderListItem = ({item}: {item: Faq; index?: number}) => (
    <ListItemNarrow onPress={() => openView(item.id)}>
      <Flex flexShrink={1} flexGrow={1}>
        <ListItemContentTop>
          <ListItemContentTopText>{item.name}</ListItemContentTopText>
        </ListItemContentTop>
      </Flex>
      <Icon name={IconTypes.Forward} color="#E6E6F0" size={22} />
    </ListItemNarrow>
  );

  return (
    <>
      <List<Faq>
        data={faqs}
        loading={loading}
        renderItem={renderListItem}
        keyExtractor={(item: Faq) => `${item.id}-${Math.random()}`}
        type="narrow"
      />
      {viewModal && (
        <ViewFaqModal closeModal={onModalClose} faqId={faqId as number} />
      )}
    </>
  );
};
