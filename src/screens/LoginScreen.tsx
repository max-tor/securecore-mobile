import React from 'react';

import {LoginForm} from '@/components';
import {GuestLayout} from '@/layouts';

export const LoginScreen = () => (
  <GuestLayout title="Log In" subtitle="Please enter your details">
    <LoginForm />
  </GuestLayout>
);
