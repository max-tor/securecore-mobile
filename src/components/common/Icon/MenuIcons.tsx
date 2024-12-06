import React from 'react';

import {Icon, IconTypes} from './index';

interface IconProps {
  color: string;
}

export const DashboardIcon = ({color}: IconProps) => (
  <Icon name={IconTypes.Dashboard} color={color} size={20} />
);
export const CompanyIcon = ({color}: IconProps) => (
  <Icon name={IconTypes.Case} color={color} size={20} />
);
export const SearchIcon = ({color}: IconProps) => (
  <Icon name={IconTypes.Search} color={color} size={20} />
);
export const MenuIcon = ({color}: IconProps) => (
  <Icon name={IconTypes.Menu} color={color} size={20} />
);
