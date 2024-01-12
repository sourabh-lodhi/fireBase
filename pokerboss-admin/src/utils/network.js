import axios from "axios";
import { contentTypeJson } from "@/constants/api";
import { BASE_API_URL } from "@/constants/api";
export const makeNetworkCall = async (params) => {
  const { method, endpoints, bodyData } = params;
  const url = BASE_API_URL + endpoints;
  const headers = contentTypeJson();
  try {
    const networkCall = await axios({
      method: method,
      url: url,
      data: bodyData,
      headers: headers,
    });
    return networkCall;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
