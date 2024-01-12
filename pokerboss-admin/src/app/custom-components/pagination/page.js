import React from "react";
import CustomPagination from "@/components/pagination/custom-pagination";

const PaginationPage = () => {
  return (
    <div className="vh-100 bg-light d-flex justify-content-center">
      <div className="text-center p-2">
        <p className="fs-3 font-bold">Pagination Component</p>
        <CustomPagination data={[0, 1, 2, 3, 4]} />
      </div>
    </div>
  );
};

export default PaginationPage;
