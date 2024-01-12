import React from "react";
import { Container, Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <div className="main-content">
      <Container fluid>
        <div className="d-flex justify-content-center bg-light align-items-center min-vh-100">
          <Spinner
            animation="border"
            className="text-center"
            variant="primary"
          />
          <p className="m-2"> Loading</p>
        </div>
      </Container>
    </div>
  );
}
