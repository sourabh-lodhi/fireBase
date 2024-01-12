import React from "react";
import { Button } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-between">
        <div>
          <p className="text-muted fs-6 ">overview</p>
          <h2 className="fs-4 bold ">Dashboard</h2>
        </div>
        <div>
          <Button className="w-100 my-3">Create Report</Button>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Dashboard;
