"use client";
import React from "react";
import Accordions from "../accordion/accordion";
import "bootstrap/dist/css/bootstrap.css";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import {
  authProps,
  componentsProps,
  SideNavFirstAccordion,
} from "@/constants/dummy-data";
import { Button } from "react-bootstrap";
import { deleteItemInCookies, getTokenFromCookies } from "@/utils/cookieHelper";
import { useRouter } from "next/navigation";
import { authStore } from "@/mobx/stores/auth-store";
import { userStore } from "@/mobx/stores/user-store";

const SideNav = () => {
  const router = useRouter();
  const logOut = async () => {
    authStore.removeUserDetail();
    userStore?.removeUserDetailId();
    if (!authStore.userDetails.token) {
      router.replace("/");
    }
  };
  return (
    <div className="container flex-column justify-content-between bg-white">
      <div>
        <div className="mx-auto mt-5  ">
          <Accordions data={SideNavFirstAccordion} />

          {/* <div className="px-3 pt-2 d-flex ">
            <FeatherIcon icon="home" className="m-1" size="17" />
            <p className="text-muted px-2  font-weight-bold bg-white">
              Dashboards
            </p>
          </div>

          <div className="px-3 pt-2 d-flex ">
            <FeatherIcon icon="file" className="m-1" size="17" />
            <p className="text-muted px-2  font-weight-bold bg-white">Pages</p>
          </div> */}
          <div className="px-3 pt-2 d-flex ">
            <FeatherIcon icon="grid" className="m-1" size="17" />
            <button
              onClick={() => router.push("/dashboard/users")}
              className="text-muted px-2 border-0 font-weight-bold bg-white"
            >
              Users
            </button>
          </div>

          <div className="ml-1">
            <Accordions data={authProps} />
          </div>
        </div>
        <hr />
        <div className="mx-auto ">
          <div className="px-3 pt-2 d-flex ">
            <FeatherIcon icon="clipboard" className="mt-1" size="17" />
            <p className="text-muted px-2  font-weight-bold bg-white">Basic</p>
          </div>
          {/* <div className="px-3 pt-2 d-flex">
            <FeatherIcon icon="book-open" className="mt-1" size="17" />
            <p className="text-muted px-2  font-weight-bold bg-white">
              Component
            </p>
          </div> */}
          <div className="ml-1">
            <Accordions data={componentsProps} />
          </div>
          <div className="px-3 pt-2 d-flex">
            <FeatherIcon icon="git-branch" className="mt-1" size="17" />
            <p className="text-muted px-2  font-weight-bold bg-white">
              Changelog
            </p>
          </div>
        </div>
      </div>
      <div className="fixed-bottom mx-auto my-2 ms-2">
        <Button size="lg" onClick={() => logOut()} className=" px-5 ms-4">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default SideNav;
