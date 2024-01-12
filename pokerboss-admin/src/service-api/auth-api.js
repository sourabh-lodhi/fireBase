import { makeNetworkCall } from '../utils/network';

const signin = (params) => {
  const { bodyData } = params;
  const endpoints = 'auth-login';
  const config = {
    endpoints,
    method: 'POST',
    bodyData,
  };
  return makeNetworkCall(config);
};
const signup = (params) => {
  const { bodyData } = params;
  const endpoints = 'auth-register';
  const config = {
    endpoints,
    method: 'POST',
    bodyData,
  };
  return makeNetworkCall(config);
};

const recoverAccount = (params) => {
  const { bodyData } = params;
  const endpoints = 'auth-resetPassword';
  const config = {
    endpoints,
    method: 'POST',
    bodyData,
  };
  return makeNetworkCall(config);
};

export default {
  signin,
  signup,
  recoverAccount,
};
