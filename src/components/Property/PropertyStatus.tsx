import {PropertyStatuses} from '@securecore-new-application/securecore-datacore/lib/types';
import React from 'react';

import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';

const PropertyIcons = {
  'In Review': <Icon name={IconTypes.Time} color="#8E8FA1" size={16} />,
  Approved: <Icon name={IconTypes.Approved} color="#8E8FA1" size={14} />,
  Rejected: <Icon name={IconTypes.Rejected} color="#EF4444" size={14} />,
};

export const PropertyStatus: React.FC<{status: PropertyStatuses}> = ({
  status,
}) => PropertyIcons[status];
