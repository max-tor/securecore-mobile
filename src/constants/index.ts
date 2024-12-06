import {TeamRoles} from '@securecore-new-application/securecore-datacore/lib/types';

export const passwordRegex =
  // eslint-disable-next-line no-control-regex
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

export const userNameRegexp =
  /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const userRoles = [
  {
    key: TeamRoles.ADMIN,
    label: 'Admin',
  },
  {
    key: TeamRoles.STAFF_MEMBER,
    label: 'Staff Member',
  },
  {
    key: TeamRoles.MANAGER,
    label: 'Manager',
  },
];

export const userTitles = [
  {
    key: 'maintenanceTechnician',
    label: 'Maintenance Technician',
  },
  {
    key: 'maintenanceManager',
    label: 'Maintenance Manager',
  },
  {
    key: 'propertyManager',
    label: 'Property Manager',
  },
  {
    key: 'regionalPropertyManager',
    label: 'Regional Property Manager',
  },
  {
    key: 'regionalMaintenanceManager',
    label: 'Regional Maintenance Manager',
  },
  {
    key: 'corporateLeadership',
    label: 'Corporate Leadership',
  },
  {
    key: 'leasingAgent',
    label: 'Leasing Agent',
  },
  {
    key: 'other',
    label: 'Other',
  },
];

export const phoneMask = [
  '+1 (',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
];

export const naLabel = 'n/a';

export const debouncedWait = 400;

export const PHONE_MASK = '+1 (999) 999-9999';

export const PER_PAGE = 10;
