'use client';
import { useRouter } from 'next/navigation';
import FeatherIcon from 'feather-icons-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  InputGroup,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { EMAILREGEX } from '@/utils/regex';
import { QRCodeSVG } from 'qrcode.react';
import { authStore } from '@/mobx/stores/auth-store';
import { observer } from 'mobx-react-lite';
import CustomModal from '@/components/modal/custom-modal';
import Loader from '@/components/loader/loader';
import FormControl from '@/components/form-input/form-control';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  // const [secretKey, setSecretKey] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [apiCallData, setApiCallData] = useState({});
  const [screens, setScreens] = useState('Sign Up');
  const [hasToken, setHasToken] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (
      authStore?.userDetails?.token &&
      authStore?.userDetails?.completeApiCall
    ) {
      router.replace('/dashboard');
    } else {
      setHasToken(false);
    }
  }, []);

  const verifyDomain = (email) => {
    if (EMAILREGEX.test(email)) {
      if (
        email.indexOf(
          '@pokerboss.dev',
          email.length - '@pokerboss.dev'.length
        ) !== -1
      ) {
        signUp();
      } else {
        setIsEmailValid(false);
      }
    } else {
      setIsEmailValid(false);
    }
  };

  const signUp = (totp = false) => {
    const bodyData = totp
      ? {
          tOtp: otp,
          // secretKey: authStore?.userDetails?.secretKey,
          token: authStore?.userDetails?.token,
        }
      : {
          email,
          password,
        };
    authStore?.signUpUser({ bodyData }, totp);
  };
  useEffect(() => {
    if (authStore?.errorMessage) {
      setError(authStore?.errorMessage);
      setIsModalVisible(true);
    }
  }, [authStore?.errorMessage]);
  useEffect(() => {
    if (
      authStore?.userDetails?.completeApiCall &&
      authStore?.userDetails?.token
    ) {
      router.replace('/dashboard');
    }
  }, [authStore?.userDetails?.completeApiCall]);
  // if (
  //   authStore?.userDetails?.completeApiCall &&
  //   authStore?.userDetails?.token
  // ) {
  //   router.replace('/dashboard');
  // }
  useEffect(() => {
    if (authStore?.userDetails?.token) {
      if (authStore?.userDetails?.qrScanComplete) {
        setScreens('Verify OTP screen');
      } else {
        setScreens('QR Screen');
      }
    }
  }, [authStore?.userDetails?.token]);

  const SignUpScreen = () => {
    if (screens === 'Sign Up') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Sign up to access our dashboard.
          </p>
          <form>
            <div className='form-group p-2'>
              <FormControl
                label='Email Address'
                value={email}
                onChange={(evt) => {
                  setEmail(evt.target.value);
                  setIsEmailValid(true);
                }}
                type='email'
                placeholder='name@address.com'
              />
              {!isEmailValid ? (
                <small className='text-danger m-2'> * Invalid Email </small>
              ) : null}
            </div>
            <div className='form-group p-2'>
              <Row>
                <Col>
                  <FormControl label='Password' />
                </Col>
              </Row>
              <InputGroup className='input-group-merge'>
                <FormControl
                  type={showPassword ? 'text' : 'password'}
                  onChange={(eve) => setPassword(eve.target.value)}
                  placeholder='Enter your password'
                  value={password}
                />
                {showPassword ? (
                  <InputGroup.Text
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <FeatherIcon icon='eye' size='1em' />
                  </InputGroup.Text>
                ) : (
                  <InputGroup.Text
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <FeatherIcon icon='eye-off' size='1em' />
                  </InputGroup.Text>
                )}
              </InputGroup>
            </div>
            <Button
              size='lg'
              onClick={() => verifyDomain(email)}
              className='w-100 my-3 p-2'
            >
              {authStore?.loading ? (
                <Spinner animation='border' variant='light' />
              ) : (
                <small> Sign up</small>
              )}
            </Button>
            <p className='text-center'>
              <small className='text-muted text-center'>
                Already have an account? <Link href='/'>Sign in</Link>.
              </small>
            </p>
          </form>
        </>
      );
    }
  };

  const QRScreen = () => {
    if (screens === 'QR Screen') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Please scan this QR to login in future using google authenticator.
          </p>
          <div className='text-center'>
            <QRCodeSVG
              value={`otpauth://totp/${authStore?.userDetails?.email}?secret=${authStore?.userDetails?.secretKey}&issuer=pokerboss`}
            />
            <Button
              size='lg'
              onClick={() => {
                authStore?.qrScanCompleteAction(true);
                setScreens('Verify OTP screen');
              }}
              className='w-100 my-3 p-2'
            >
              <small className=' fs-6'>Verify Google Authenticator</small>
            </Button>
          </div>
        </>
      );
    }
  };
  const EnterOtpScreen = () => {
    if (screens === 'Verify OTP screen') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Enter OTP from your Google Authenticator.
          </p>
          <div>
            <FormControl
              type={'text'}
              placeholder='Enter Your Google Authenticator OTP'
              onChange={(eve) => setOtp(eve.target.value)}
              value={otp}
            />
            <Button
              size='lg'
              onClick={() => {
                signUp(true);
              }}
              className='w-100 my-3'
            >
              {authStore?.loading ? (
                <Spinner animation='border' variant='light' />
              ) : (
                <small>{'Verify'}</small>
              )}
            </Button>
          </div>
        </>
      );
    }
  };
  if (hasToken) {
    return <Loader />;
  }
  return (
    <div className='d-flex align-items-center min-vh-100 bg-light border-top border-top-2 border-primary'>
      <Container>
        <Row className='justify-content-center'>
          <Col xs={12} md={5} xl={4} className='my-5'>
            <h1 className='font-weight-bold text-center mb-3'>Sign up</h1>

            <>{SignUpScreen()}</>
            <>{QRScreen()}</>
            <>{EnterOtpScreen()}</>
          </Col>
        </Row>
      </Container>
      {isModalVisible ? (
        <CustomModal
          isModalVisible={isModalVisible}
          onDismiss={() => {
            setIsModalVisible(false);
            authStore?.removeErrorMessage();
          }}
          header='Error'
          bodyContent={error}
          isError={error}
        />
      ) : null}
    </div>
  );
};
export default observer(SignUp);
