import React from "react";
import Accordions from "@/components/accordion/accordion";
import { customArrordionData } from "@/constants/dummy-data";

const AccordionPage = () => {
  return (
    <div className="vh-100 bg-light d-flex justify-content-center">
      <div className="text-center p-2">
        <p className="fs-3 font-bold">Accordion Component</p>
        <Accordions data={customArrordionData} />
      </div>
    </div>
  );
};

export default AccordionPage;
