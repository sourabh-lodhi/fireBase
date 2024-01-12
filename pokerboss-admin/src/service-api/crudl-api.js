const { makeNetworkCall } = require("@/utils/network");

const getData = () => {
  const endpoints = "auth-getUserDetails";
  const config = {
    endpoints,
    method: "GET",
  };
  return makeNetworkCall(config);
};

const editUserData = (params) => {
  const { bodyData } = params;
  const endpoints = "auth-editUserDetails";
  const config = {
    endpoints,
    method: "POST",
    bodyData,
  };
  return makeNetworkCall(config);
};
const getUserDataByUid = (params) => {
  const { bodyData } = params;
  const endpoints = "auth-getUserDetailById";
  const config = {
    endpoints,
    method: "POST",
    bodyData,
  };
  return makeNetworkCall(config);
};

export default {
  editUserData,
  getData,
  getUserDataByUid,
};
