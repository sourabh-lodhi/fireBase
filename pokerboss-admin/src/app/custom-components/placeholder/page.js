"use client";
import React from "react";
import CustomPlaceholder from "@/components/placeholder/custom-placeholder";

const PlaceholderPage = () => {
  return (
    <div className="vh-100 bg-light d-flex justify-content-center">
      <div className="text-center p-2">
        <p className="fs-3 font-bold">Pagination Component</p>
        <div className="d-flex justify-content-around">
          <CustomPlaceholder />
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
