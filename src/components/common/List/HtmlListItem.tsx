import React from 'react';

import {Divider, HtmlView} from '@/components';
import {
  ListItemRowContent,
  ListItemRowData,
} from '@/components/common/List/styles';

export interface HtmlListItemProps {
  title: string;
  html: string;
}
export const HtmlListItem: React.FC<HtmlListItemProps> = ({html, title}) => (
  <>
    <Divider
      text={title}
      _viewStyles={{marginBottom: 12}}
      _text={{
        fontFamily: 'SF Pro Text',
        fontWeight: 600,
        fontSize: 12,
      }}
    />
    <ListItemRowData col>
      <ListItemRowContent full>
        <HtmlView
          contentHtml={html as string}
          baseStyle={{
            padding: 0,
          }}
        />
      </ListItemRowContent>
    </ListItemRowData>
  </>
);
