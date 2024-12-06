/* eslint-disable global-require,import/no-unresolved */
import {yupResolver} from '@hookform/resolvers/yup';
import {Entypo} from '@native-base/icons';
import {
  AuthResponse,
  useLogInMutation,
} from '@securecore-new-application/securecore-datacore';
import {FormControl, HStack, Icon, Link, useToast, VStack} from 'native-base';
import * as React from 'react';
import {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {
  ACCESS_CONTROL,
  ACCESSIBLE,
  BIOMETRY_TYPE,
  getGenericPassword,
  Options,
  resetGenericPassword,
  setGenericPassword,
  STORAGE_TYPE,
} from 'react-native-keychain';
import * as yup from 'yup';

import {PasswordInput, TextInput} from '@/components';
import {biometryMapping, BioModal} from '@/components/BioModal/BioModal';
import {AuthContext} from '@/contexts/auth';
import {BiometryDecision, LogInPayload} from '@/contexts/auth/types';

import {Button} from '../common/Button';
import {StyledLoginForm} from './styles';

const SERVICE_NAME = 'com.securecore.goto';
const CREDENTIALS_CONFIG: Options = {
  service: SERVICE_NAME,
  accessControl: ACCESS_CONTROL.BIOMETRY_ANY,
  accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  storage: STORAGE_TYPE.RSA,
};

export const passwordRegexp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
interface FormData {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup.string().required('Email is a required field'),
    password: yup
      .string()
      .required('Password is a required field')
      .matches(passwordRegexp, 'Invalid password!'),
  })
  .required();

const defaultValues = {
  email: __DEV__ ? 'anri.mobile' : '',
  password: __DEV__ ? 'Secret#123' : '',
};

const formLink = {
  color: 'main.black',
  fontSize: 'sm',
  lineHeight: 20,
  fontFamily: 'SF Pro Text',
  fontStyle: 'normal',
  fontWeight: '400',
  textDecoration: 'none',
};

export const LoginForm = () => {
  const {
    signIn,
    checkSupportedBiometryTypes,
    biometryType,
    biometryEnabled,
    disableBiometry,
    enableBiometry,
    resetBiometry,
  } = useContext(AuthContext);
  const toast = useToast();
  const [logIn, {loading}] = useLogInMutation();
  const [logInWithoutLoading] = useLogInMutation();
  const [loginData, setLoginData] = useState<LogInPayload | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    checkSupportedBiometryTypes();
  }, [checkSupportedBiometryTypes]);

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const doLogIn = useCallback(
    async (
      data: FormData,
      showLoadingState = true,
    ): Promise<AuthResponse | undefined> => {
      const operation = showLoadingState ? logIn : logInWithoutLoading;
      const dataLogin = await operation({variables: {data}});

      return dataLogin?.data?.logIn;
    },
    [logIn, logInWithoutLoading],
  );

  const onBiometryAuthFailed = useCallback(async () => {
    await resetGenericPassword(CREDENTIALS_CONFIG);
    await resetBiometry();

    toast.show({
      title: 'Invalid credentials, please try regular log in.',
      placement: 'top',
    });
  }, [resetBiometry, toast]);

  const logInWithBiometrics = useCallback(async () => {
    try {
      const credentials = await getGenericPassword({service: SERVICE_NAME});

      if (!credentials) {
        await onBiometryAuthFailed();

        return;
      }

      const {username, password} = credentials;

      const resp = await doLogIn(
        {email: username, password: `${password}`},
        false,
      );

      signIn({
        token: resp?.token as string,
        role: resp?.role as string,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({message, code}) {
      if (message === 'Incorrect username or password') {
        await onBiometryAuthFailed();
      } else if (!code) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    }
  }, [doLogIn, onBiometryAuthFailed, signIn, toast]);

  const {register, handleSubmit} = methods;

  const setCredentials = async (data: FormData) => {
    await setGenericPassword(data.email, data.password, CREDENTIALS_CONFIG);
  };

  const onLogin = useCallback(
    async (data: FormData) => {
      try {
        const dataLogin = await doLogIn(data);

        if (
          biometryType !== null &&
          biometryEnabled === BiometryDecision.NOT_DEFINED
        ) {
          setLoginData(dataLogin as LogInPayload);
        } else {
          if (biometryEnabled === BiometryDecision.ENABLED) {
            await setCredentials(data);
          }
          signIn(dataLogin as LogInPayload);
        }

        setFormData(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch ({message}) {
        toast.show({
          title: `${message}`,
          placement: 'top',
        });
      }
    },
    [doLogIn, biometryType, biometryEnabled, signIn, toast],
  );

  const onBioModalConfirm = useCallback(async () => {
    await enableBiometry();
    if (formData && loginData) {
      await getGenericPassword(CREDENTIALS_CONFIG);

      await setCredentials(formData);

      signIn(loginData as LogInPayload);
    }
  }, [enableBiometry, formData, loginData, signIn]);

  const onBioModalCancel = useCallback(async () => {
    await disableBiometry();
    if (loginData) {
      signIn(loginData as LogInPayload);
    }
  }, [disableBiometry, loginData, signIn]);

  const btnText = useMemo(
    () => `Log In with ${biometryMapping[biometryType as BIOMETRY_TYPE]}`,
    [biometryType],
  );

  return (
    <StyledLoginForm>
      <FormProvider {...methods}>
        <VStack space={0} mt="5">
          <FormControl>
            <FormControl.Label>Username</FormControl.Label>
            <TextInput
              InputLeftElement={
                <Icon
                  as={Entypo}
                  name="user"
                  ml="2"
                  width={20}
                  height={20}
                  color="darkGrey"
                />
              }
              keyboardType="email-address"
              type="text"
              autoCapitalize="none"
              {...register('email', {})}
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <PasswordInput {...register('password', {})} />
          </FormControl>

          <HStack mt="6" justifyContent="space-between">
            {/* <Checkbox*/}
            {/*  _text={formLink}*/}
            {/*  value="remember-me"*/}
            {/*  accessibilityLabel="Remember me"*/}
            {/*  defaultIsChecked>*/}
            {/*  Remember me*/}
            {/* </Checkbox>*/}

            <Link _text={{...formLink, color: 'primary.500'}} href="/">
              Forgot Password?
            </Link>
          </HStack>
          <Button onPress={handleSubmit(onLogin)} isLoading={loading} my={5}>
            Log In
          </Button>
          {biometryEnabled === BiometryDecision.ENABLED && biometryType && (
            <Button onPress={logInWithBiometrics} mt={0}>
              {btnText}
            </Button>
          )}
        </VStack>
      </FormProvider>
      {loginData && (
        <BioModal
          onCancel={onBioModalCancel}
          isOpen={!!loginData}
          onConfirm={onBioModalConfirm}
        />
      )}
    </StyledLoginForm>
  );
};
