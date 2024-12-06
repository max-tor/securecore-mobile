import React from 'react';

import {StyledMainPageContainer} from '@/layouts/styles';

export const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
  title?: string;
}): JSX.Element => (
  <StyledMainPageContainer>{children}</StyledMainPageContainer>
);
