import { dataAPI } from "@/service-api";
import { observable, action, runInAction, makeObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class UserStore {
  allUsersData = [];
  errorMessage = "";
  loading = false;
  userDetailId = {
    uid: "",
  };
  singleUserData = {};

  constructor() {
    makeObservable(this, {
      allUsersData: observable,
      singleUserData: observable,
      errorMessage: observable,
      userDetailId: observable,
      loading: observable,
      getAllUsersData: action,
      addUserDetailPageId: action,
      getUserDataById: action,
      removeSingleUserData: action,
    });
    makePersistable(this, {
      name: "UserStore",
      properties: ["userDetailId"],
      storage: localStorage,
    });
  }
  addUserDetailPageId = (details) => {
    this.userDetailId = { ...this.userDetailId, ...details };
  };
  getAllUsersData = async () => {
    this.loading = true;
    try {
      const apiCall = await dataAPI.getData();

      if (apiCall?.status === 200) {
        runInAction(() => {
          this.allUsersData = apiCall?.data?.data;
          this.loading = false;
        });
      } else {
        runInAction(() => {
          this.errorMessage = apiCall?.response?.data?.error;
          this.loading = false;
        });
      }
    } catch (error) {
      this.loading = false;
      this.errorMessage = error?.response?.data?.error;
    }
  };

  getUserDataById = async (id) => {
    try {
      const apiCall = await dataAPI.getUserDataByUid(id);

      if (apiCall?.status === 200) {
        runInAction(() => {
          this.singleUserData = apiCall?.data?.data;
        });
      } else {
        runInAction(() => {
          this.errorMessage = apiCall?.response?.data?.error;
        });
      }
    } catch (error) {
      this.errorMessage = error?.response?.data?.error;
    }
  };
  removeSingleUserData = () => {
    this.singleUserData = {};
  };
  removeUserDetailId = () => {
    this.userDetailId = { uid: "" };
  };
}

export const userStore = new UserStore();
