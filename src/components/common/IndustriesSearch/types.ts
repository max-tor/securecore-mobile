import {
  Industry,
  IndustryTypes,
} from '@securecore-new-application/securecore-datacore/lib/types';
import {FieldValues, UseFormSetValue} from 'react-hook-form';

export interface IndustriesSearchProps {
  debounceTimeout?: number;
  isDisabled?: boolean;
  value: Industry[];
  setValue: UseFormSetValue<FieldValues>;
  type?: IndustryTypes;
}
