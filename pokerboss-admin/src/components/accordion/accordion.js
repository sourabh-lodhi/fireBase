"use client";
import React from "react";
import { Accordion } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";

const Accordions = ({ data = [] }) => {
  return (
    <>
      <Accordion defaultActiveKey="0">
        {data?.length &&
          Array.isArray(data) &&
          data?.map((item, index) => {
            return (
              <Accordion.Item
                bsPrefix="bg-transparent mr-3 text-muted fs-6"
                eventKey={index}
              >
                <Accordion.Header as="div">
                  {/* <div className="mb-1"> */}
                  <FeatherIcon icon={item?.icon} className="me-1" size="17" />
                  {/* </div> */}
                  <div className="text-muted fs-6">{item?.heading}</div>
                </Accordion.Header>
                {item?.body?.length &&
                  Array.isArray(item?.body) &&
                  item?.body?.map((v, index) => {
                    return (
                      <>
                        {Array.isArray(v) ? (
                          <Accordions data={v} />
                        ) : (
                          <Link href={v?.href} key={index} passHref>
                            <Accordion.Body className="btn text-muted">
                              <small>{v?.value}</small>
                            </Accordion.Body>
                          </Link>
                        )}
                      </>
                    );
                  })}
              </Accordion.Item>
            );
          })}
      </Accordion>
    </>
  );
};

export default Accordions;
