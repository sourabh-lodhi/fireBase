'use client';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row, Button, Form, Spinner } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import authApi from '@/service-api/auth-api';
import CustomModal from '@/components/modal/custom-modal';
import { commonText } from '@/constants/dummy-data';
import { authStore } from '@/mobx/stores/auth-store';
import { observer } from 'mobx-react-lite';
import FormControl from '@/components/form-input/form-control';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [screens, setScreens] = useState('Forget Password');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const resetPassword = () => {
    const bodyData = {};
    if (authStore?.resetPasswordObj?.screen === 'Forget Password') {
      bodyData.email = email;
    } else if (authStore?.resetPasswordObj?.screen === 'OTP Screen') {
      bodyData.emailOtp = otp;

      bodyData.token = authStore?.resetPasswordObj?.token;
    } else if (
      authStore?.resetPasswordObj?.screen === 'Set New Password Screen'
    ) {
      bodyData.token = authStore?.resetPasswordObj?.token;
      bodyData.newPassword = password;
    }

    authStore?.resetPassword({ bodyData });
    if (authStore.userDetails.token) {
      setToken(true);
    }
  };

  useEffect(() => {
    setScreens(authStore?.resetPasswordObj?.screen);
  }, [authStore?.resetPasswordObj?.screen]);
  useEffect(() => {
    if (authStore?.errorMessage) {
      setError(authStore?.errorMessage);
      setIsModalVisible(true);
    }
  }, [authStore?.errorMessage]);

  const EnterEmailScreen = () => {
    if (screens === 'Forget Password') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Enter your email to get OTP on your registered email.
          </p>
          <form>
            <div className='form-group p-2'>
              <FormControl
                label='Email Address'
                value={email}
                onChange={(eve) => setEmail(eve.target.value)}
                type='email'
                placeholder='name@address.com'
              />
            </div>
            <Button
              size='lg'
              onClick={() => resetPassword()}
              className='w-100 my-3'
            >
              {authStore?.loading ? (
                <Spinner animation='border' variant='light' />
              ) : (
                <small>Reset Password</small>
              )}
            </Button>
            <p className='text-center'>
              <small className='text-muted text-center'>
                Remember your password? <Link href='/'>Log in</Link>.
              </small>
            </p>
          </form>
        </>
      );
    }
  };

  const successfullScreen = () => {
    if (screens === 'Password Updated Successfully') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Password Updated Successfully
          </p>
          <Button
            size='lg'
            onClick={() => {
              router.replace('/');
              authStore?.removeResetPasswordObj();
            }}
            className='w-100 my-3'
          >
            <small>{token ? 'Go to dashboard' : 'Go to Sign in'}</small>
          </Button>
        </>
      );
    }
  };
  const SetNewPasswordScreen = () => {
    if (screens === 'Set New Password Screen') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Enter your new password.
          </p>
          <form>
            <div className='form-group p-2'>
              <FormControl
                label='Password'
                onChange={(eve) => setPassword(eve.target.value)}
                type='email'
                placeholder='Enter New Password'
                value={password}
              />
            </div>
            <Button
              size='lg'
              onClick={() => resetPassword()}
              className='w-100 my-3'
            >
              <small>Submit</small>
            </Button>
          </form>
        </>
      );
    }
  };

  const EnterOtpScreen = () => {
    if (screens === 'OTP Screen') {
      return (
        <>
          <p className='text-muted text-center mb-4'>
            Otp has been send to your registered email address
          </p>
          <form>
            <div className='form-group p-2'>
              <FormControl
                onChange={(eve) => setOtp(eve.target.value)}
                type='text'
                placeholder='Enter OTP'
                value={otp}
              />
            </div>
            <Button
              size='lg'
              onClick={() => resetPassword()}
              className='w-100 my-3'
            >
              <small>Submit</small>
            </Button>
          </form>
        </>
      );
    }
  };

  return (
    <div className='d-flex align-items-center min-vh-100 bg-light border-top border-top-2 border-primary'>
      <Container>
        <Row className='justify-content-center'>
          <Col xs={12} md={5} xl={4} className='my-5'>
            <h1 className='font-weight-bold text-center mb-3'>
              Password reset
            </h1>
            <>{EnterEmailScreen()}</>
            <>{EnterOtpScreen()}</>
            <>{SetNewPasswordScreen()}</>
            <>{successfullScreen()}</>
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

export default observer(PasswordReset);
