"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { userStore } from "@/mobx/stores/user-store";
import { observer } from "mobx-react-lite";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import FormControl from "@/components/form-input/form-control";

const userDetail = () => {
  const [isEditabe, setIsEditabe] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    email: "",
    status: "",
    username: "",
    uid: "",
    phone: "",
  });
  useEffect(() => {
    userStore?.getUserDataById({
      bodyData: { uid: userStore?.userDetailId?.uid },
    });

    return () => {
      userStore?.removeSingleUserData();
      setUserData({
        email: "",
        status: "",
        username: "",
        uid: "",
        phone: "",
      });
    };
  }, []);

  useEffect(() => {
    if (userStore?.singleUserData?.uid) {
      setUserData({ ...userStore?.singleUserData });
      setIsLoading(false);
    }
  }, [userStore?.singleUserData]);

  const handleUserData = (text, event) =>
    setUserData((prev) => ({ ...prev, [event]: text }));

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="main-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <form>
              <Row className="justify-content-between align-items-center mt-5">
                <Col>
                  <Row className="align-items-center">
                    <Col className="ms-n2 ">
                      <h4 className="mb-1 ">Edit User Details</h4>
                    </Col>
                  </Row>
                </Col>
                <Col xs="auto">
                  <Button size="sm" onClick={() => setIsEditabe(!isEditabe)}>
                    Edit
                  </Button>
                </Col>
              </Row>
              <hr className="my-3" />
              <Row>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <FormControl
                      label="User name"
                      value={userData?.username}
                      disabled={!isEditabe}
                      type="text"
                      onChange={(event) =>
                        handleUserData(event.target.value, "username")
                      }
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form-group">
                    <FormControl
                      label="Status"
                      value={userData?.status}
                      type="text"
                      disabled={!isEditabe}
                      onChange={(event) =>
                        handleUserData(event.target.value, "status")
                      }
                    />
                  </div>
                </Col>
                <Col xs={12} className="mt-3">
                  <div className="form-group">
                    <FormControl
                      label="Email address"
                      disabled={!isEditabe}
                      value={userData?.email}
                      type="email"
                      onChange={(event) =>
                        handleUserData(event.target.value, "email")
                      }
                    />
                  </div>
                </Col>
                <Col xs={12} md={6} className="mt-3">
                  <div className="form-group">
                    <FormControl
                      label="Phone"
                      value={userData?.phone || ""}
                      disabled={!isEditabe}
                      placeholder="NA"
                      mask="_"
                      type="text"
                      onChange={(event) =>
                        handleUserData(event.target.value, "phone")
                      }
                    />
                  </div>
                </Col>
                <Col xs={12} md={6} className="col-12 mt-3 col-md-6">
                  <div className="form-group">
                    <FormControl
                      label="Id"
                      value={userData?.uid}
                      disabled={!isEditabe}
                      type="text"
                      onChange={(event) =>
                        handleUserData(event.target.value, "uid")
                      }
                    />
                  </div>
                </Col>
              </Row>
              <br />
              <Button>Save changes</Button>
              <hr className="my-5" />

              <Row className="justify-content-between">
                <Col xs={12} md={6} className="col-12 col-md-6">
                  <h4>Delete account</h4>
                  <p className="small text-muted mb-md-0">
                    Please note, deleting account is a permanent action and will
                    no be recoverable once completed.
                  </p>
                </Col>
                <Col xs="auto">
                  <Button variant="danger">Delete</Button>
                </Col>
              </Row>
            </form>
            <br />
            <br />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default observer(userDetail);
