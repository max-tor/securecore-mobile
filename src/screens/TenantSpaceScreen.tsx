import React from 'react';

import {TenantSpace} from '@/components/TenantSpace/TenantSpace';
import {MainLayout} from '@/layouts';

export const TenantSpaceScreen = () => (
  <MainLayout title="Tenant Space">
    <TenantSpace />
  </MainLayout>
);
