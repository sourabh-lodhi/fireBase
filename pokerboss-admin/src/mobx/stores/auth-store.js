import { authAPI } from '@/service-api';
import { makeObservable, action, observable, runInAction } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

class AuthStore {
  userDetails = {
    email: '',
    uid: '',
    token: '',
    secretKey: '',
    completeApiCall: false,
    qrScanComplete: false,
  };
  resetPasswordObj = {
    message: '',
    token: '',
    screen: 'Forget Password',
  };
  loading = false;
  errorMessage = '';

  constructor() {
    makeObservable(this, {
      userDetails: observable,
      errorMessage: observable,
      loading: observable,
      resetPasswordObj: observable,
      addUserDetail: action,
      removeUserDetail: action,
      signInUser: action,
      qrScanCompleteAction: action,
      resetPassword: action,
      removeErrorMessage: action,
      removeResetPasswordObj: action,
    });
    makePersistable(this, {
      name: 'Authstore',
      properties: ['userDetails'],
      storage: localStorage,
    });
  }
  addUserDetail = (details) => {
    this.userDetails = { ...this.userDetails, ...details };
  };
  removeUserDetail = () => {
    this.userDetails = { email: '', uid: '', token: '' };
  };
  qrScanCompleteAction = (flag) => {
    this.userDetails = { ...this.userDetails, qrScanComplete: flag };
  };

  resetPassword = async (bodyData) => {
    try {
      this.loading = true;
      const apiCall = await authAPI?.recoverAccount(bodyData);
      if (
        apiCall?.status === 200 &&
        apiCall?.data?.data?.notice[0] ===
          'A otp has been sent to your registered email'
      ) {
        runInAction(() => {
          this.resetPasswordObj = {
            ...this.resetPasswordObj,
            token: apiCall?.data?.data?.values?.token,
            screen: 'OTP Screen',
          };
          this.loading = false;
        });
      } else if (
        apiCall?.status === 200 &&
        apiCall?.data?.data?.notice[0] === 'OTP Verified Successfully'
      ) {
        runInAction(() => {
          this.resetPasswordObj = {
            ...this.resetPasswordObj,
            screen: 'Set New Password Screen',
          };
          this.loading = false;
        });
      } else if (
        apiCall?.status === 200 &&
        apiCall?.data?.data?.notice[0] === 'New password created successfully'
      ) {
        runInAction(() => {
          this.resetPasswordObj = {
            ...this.resetPasswordObj,
            screen: 'Password Updated Successfully',
          };
          this.loading = false;
        });
      } else {
        this.errorMessage = apiCall?.response?.data?.data?.errors
          ? (Object.values(apiCall?.response?.data?.data?.errors) ??
              [])?.[0]?.[0]
          : apiCall?.response?.data?.data?.notice[0];
        this.loading = false;
      }
    } catch (error) {
      this.errorMessage = error?.response?.data?.data?.errors
        ? (Object.values(error?.response?.data?.data?.errors) ?? [])?.[0]?.[0]
        : error?.response?.data?.data?.notice[0];
      this.loading = false;
    }
  };

  signInUser = async (body, Totp) => {
    const { email } = body?.bodyData;
    try {
      this.removeErrorMessage();
      this.loading = true;
      const apiCall = await authAPI.signin(body);
      if (Totp && apiCall?.status === 200) {
        runInAction(() => {
          this.userDetails = {
            ...this.userDetails,
            token: apiCall?.data?.data?.values?.token,
            completeApiCall: true,
          };
          this.loading = false;
        });
      } else if (apiCall?.status === 200) {
        runInAction(() => {
          this.userDetails = {
            ...this.userDetails,

            token: apiCall?.data?.data?.values?.token,
            email,
          };
          this.loading = false;
        });
      } else {
        runInAction(() => {
          this.errorMessage = apiCall?.response?.data?.data?.errors
            ? (Object.values(apiCall?.response?.data?.data?.errors) ??
                [])?.[0]?.[0]
            : apiCall?.response?.data?.data?.notice[0];
          this.loading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.errorMessage = error?.response?.data?.data?.errors
          ? (Object.values(error?.response?.data?.data?.errors) ?? [])?.[0]?.[0]
          : error?.response?.data?.data?.notice[0];
        this.loading = false;
      });
    }
  };

  signUpUser = async (body, Totp) => {
    const { email } = body?.bodyData;
    try {
      this.removeErrorMessage();
      this.loading = true;
      const apiCall = await authAPI.signup(body);
      if (Totp && apiCall?.status === 200) {
        runInAction(() => {
          this.userDetails = {
            ...this.userDetails,
            token: apiCall?.data?.data?.values?.token,
            completeApiCall: true,
          };
          this.loading = false;
        });
      } else if (apiCall?.status === 200) {
        runInAction(() => {
          this.userDetails = {
            ...this.userDetails,
            email: email,
            secretKey: apiCall?.data?.data?.values?.googleAuthSetup?.secretKey,
            token: apiCall?.data?.data?.values?.token,
          };
          this.loading = false;
        });
      } else {
        runInAction(() => {
          this.errorMessage = apiCall?.response?.data?.data?.errors
            ? (Object.values(apiCall?.response?.data?.data?.errors) ??
                [])?.[0]?.[0]
            : apiCall?.response?.data?.data?.notice[0];
          this.loading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.errorMessage = error?.response?.data?.data?.errors
          ? (Object.values(error?.response?.data?.data?.errors) ?? [])?.[0]?.[0]
          : error?.response?.data?.data?.notice[0];
        this.loading = false;
      });
    }
  };

  removeErrorMessage = () => {
    this.errorMessage = '';
  };
  removeResetPasswordObj = () => {
    this.resetPasswordObj = {
      message: '',
      uid: '',
      screen: 'Forget Password',
    };
  };
}

export const authStore = new AuthStore();
