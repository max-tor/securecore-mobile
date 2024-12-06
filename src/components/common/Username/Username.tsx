import {useCheckUserName} from '@securecore-new-application/securecore-datacore';
import {Modal} from 'components/common/Modal';
import {FormControl, Text} from 'native-base';
import React, {useCallback, useState} from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
} from 'react-hook-form';
import {TouchableOpacity} from 'react-native';

import {userNameRegexp} from '../../../constants';
import {TextInput} from '../TextInput';
import {HintTrigger, TriggerText} from './styles';

interface UsernameProps {
  control: Control<FieldValues, unknown>;
  loading: boolean;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
}

export const Username = ({
  control,
  loading,
  setError,
  clearErrors,
}: UsernameProps) => {
  const [validateUserName] = useCheckUserName();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const handleValidateUserName = useCallback(
    async (value: string) => {
      if (!value) return;

      if (!userNameRegexp.test(value)) {
        return setError('userName', {
          type: 'pattern',
          message: 'Incorrect username.',
        });
      }

      const {data: checkUserNameData} = await validateUserName({
        variables: {
          data: {
            userName: value,
          },
        },
      });

      if (checkUserNameData?.checkUserName) {
        return setError('userName', {
          type: 'custom',
          message: 'This user is already taken.',
        });
      }

      clearErrors('userName');
    },
    [clearErrors, setError, validateUserName],
  );

  const renderTrigger = () => (
    <TouchableOpacity onPress={() => setPopoverOpen(true)}>
      <HintTrigger>
        <TriggerText>?</TriggerText>
      </HintTrigger>
    </TouchableOpacity>
  );

  return (
    <>
      <FormControl>
        <FormControl.Label>
          User Name* &nbsp;{renderTrigger()}
        </FormControl.Label>
        <Controller
          control={control}
          name="userName"
          rules={{
            required: 'This field is required!',
            pattern: {
              value: userNameRegexp,
              message: 'Invalid userName!',
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onBlur: (e: any) => handleValidateUserName(e.target.value),
          }}
          render={({field}) => (
            <TextInput isDisabled={loading} type="text" {...field} />
          )}
        />
      </FormControl>
      <Modal
        isOpen={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        title="Username policy hint">
        <Text>- Only contains alphanumeric characters, underscore and dot</Text>
        <Text>
          - Underscore and dot can&#39;t be at the end or start of a username
          (e.g _username / username_ / .username / username.).
        </Text>
        <Text>
          - Underscore and dot can&#39;t be next to each other (e.g user_.name).
        </Text>
        <Text>
          - Underscore or dot can&#39;t be used multiple times in a row (e.g
          user__name / user..name).
        </Text>
        <Text>- Number of characters must be between 4 to 20.</Text>
      </Modal>
    </>
  );
};
