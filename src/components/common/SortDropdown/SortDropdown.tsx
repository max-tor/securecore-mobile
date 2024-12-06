import {
  OrderBy,
  OrderByDirection,
} from '@securecore-new-application/securecore-datacore/lib/types';
import React, {useCallback, useState} from 'react';

import Icon from '@/components/common/Icon/Icon';
import {IconTypes} from '@/components/common/Icon/icons';

import {StyledSelect} from './styles';

export const DefaultSortingOptions = [
  {
    label: 'Name A-Z',
    value: 'name-asc',
  },
  {
    label: 'Name Z-A',
    value: 'name-desc',
  },
  {
    label: 'Latest',
    value: 'createdAt-desc',
  },
  {
    label: 'Earliest',
    value: 'createdAt-asc',
  },
];

export interface SortingValue {
  value: OrderBy;
  direction: OrderByDirection;
}

export const DefaultSortingValues: Record<string, SortingValue> = {
  'name-asc': {
    value: OrderBy.NAME,
    direction: OrderByDirection.ASC,
  },
  'name-desc': {
    value: OrderBy.NAME,
    direction: OrderByDirection.DESC,
  },
  'createdAt-desc': {
    value: OrderBy.CREATED_AT,
    direction: OrderByDirection.DESC,
  },
  'createdAt-asc': {
    value: OrderBy.CREATED_AT,
    direction: OrderByDirection.ASC,
  },
};

export interface SortItemType {
  label: string;
  value: string;
}

export interface Props {
  sortingOptions: SortItemType[];
  onChange: (arg0: string) => void;
  defaultSortLabel?: string;
}

export const SortDropdown = ({
  sortingOptions,
  onChange,
  defaultSortLabel = 'Sort By',
}: Props) => {
  const [selected, setSelected] = useState<string>();

  const handleChange = useCallback(
    (value: string) => {
      setSelected(value);
      onChange(value);
    },
    [onChange],
  );

  return (
    <StyledSelect
      selectedValue={selected}
      borderColor="transparent"
      backgroundColor="#F6F6FA"
      color="#323234"
      minWidth="115"
      accessibilityLabel={defaultSortLabel}
      placeholder={defaultSortLabel}
      dropdownIcon={<Icon name={IconTypes.AngleDown} size={16} />}
      onValueChange={itemValue => handleChange(itemValue)}>
      {sortingOptions.map(item => (
        <StyledSelect.Item
          label={item.label}
          value={item.value as string}
          key={item.value}
        />
      ))}
    </StyledSelect>
  );
};
