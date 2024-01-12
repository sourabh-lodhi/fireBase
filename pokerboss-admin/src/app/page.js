'use client';
import FeatherIcon from 'feather-icons-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  InputGroup,
  Row,
  Container,
  Spinner,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/navigation';
import { authStore } from '@/mobx/stores/auth-store';
import { observer } from 'mobx-react-lite';
import CustomModal from '@/components/modal/custom-modal';
import FormControl from '@/components/form-input/form-control';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    if (authStore?.errorMessage) {
      setError(authStore?.errorMessage);
      setIsModalVisible(true);
    }
  }, [authStore?.errorMessage]);

  const signIn = (totp = false) => {
    setIsLoading(true);
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

    authStore.signInUser({ bodyData }, totp);
  };

  useEffect(() => {
    if (
      authStore?.userDetails?.completeApiCall &&
      authStore?.userDetails?.token
    ) {
      router.replace('/dashboard');
    }
  }, [authStore?.userDetails?.completeApiCall]);

  if (hasToken) {
    return (
      <div className='vh-100 bg-light d-flex justify-content-center'>
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div className='d-flex align-items-center min-vh-100 bg-light border-top border-top-2 border-primary'>
      <Container>
        <Row className='justify-content-center'>
          <Col xs={12} md={5} xl={4} className='my-5'>
            <h1 className='font-weight-bold text-center mb-3'>Sign in</h1>
            <p className='text-muted text-center mb-4'>
              Sign in to get access of our dashboard.
            </p>
            {authStore?.userDetails?.token ? (
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
                    signIn(true);
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
            ) : (
              <form>
                <div className='form-group p-2'>
                  <FormControl
                    label='Email Address'
                    type='email'
                    value={email}
                    onChange={(eve) => setEmail(eve.target.value)}
                    placeholder='name@address.com'
                  />
                </div>
                <div className='form-group p-2'>
                  <Row>
                    <Col>
                      <FormControl label='Password' />
                    </Col>
                    <Col xs='auto'>
                      <a
                        as={Link}
                        className='small text-muted'
                        href='/password-reset'
                      >
                        Forgot password?
                      </a>
                    </Col>
                  </Row>
                  <InputGroup className='input-group-merge'>
                    <FormControl
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      onChange={(eve) => setPassword(eve.target.value)}
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
                  onClick={() => {
                    signIn();
                  }}
                  className='w-100 my-3'
                >
                  {authStore?.loading ? (
                    <Spinner animation='border' variant='light' />
                  ) : (
                    <small>{'Sign in'}</small>
                  )}
                </Button>
                <p className='text-center'>
                  <small className='text-muted text-center'>
                    Don't have an account yet?{' '}
                    <Link href='/sign-up'>Sign up</Link>.
                  </small>
                </p>
              </form>
            )}
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

export default observer(SignInForm);
