"use client";
import React from "react";
import NavBarToggle from "@/components/navbars/navbar";

const AccordionPage = () => {
  return (
    <div className="vh-100 bg-light d-flex justify-content-center">
      <div className="text-center p-2">
        <p className="fs-3 font-bold">Navbar Component</p>
        <NavBarToggle />
      </div>
    </div>
  );
};

export default AccordionPage;
