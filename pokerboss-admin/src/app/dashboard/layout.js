"use client";
import React, { useEffect, useState } from "react";
// import { getTokenFromCookie } from "./action";
import { useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/utils/cookieHelper";
import { authStore } from "@/mobx/stores/auth-store";
import SideNav from "@/components/navbars/side-nav";
import NavBarToggle from "@/components/navbars/navbar";

const DashboardLayout = ({ children }) => {
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authStore?.userDetails?.token) {
      setHasToken(true);
    } else {
      router.replace("/");
    }
  }, []);
  if (!hasToken) {
    return (
      <div className="vh-100 bg-light d-flex justify-content-center">
        <p>Loading</p>
      </div>
    );
  }
  return (
    <div className="container-fluid bg-light min-vh-100 row">
      <div className="col-2 bg-white border-end border-end-1 d-none d-lg-block ">
        <div className="position-fixed">
          <SideNav />
        </div>
      </div>
      <div className="col-lg-10 col-12 bg-light ">
        <div className="mx-2 my-3">
          <div className="d-lg-none mb-3">
            <NavBarToggle />
            <hr />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
