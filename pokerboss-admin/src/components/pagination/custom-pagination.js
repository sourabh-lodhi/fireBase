"use client";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import React, { useState } from "react";
import { Card, Pagination } from "react-bootstrap";

const CustomPagination = (props) => {
  const [page, setPage] = useState(0);

  return (
    <div className="py-4">
      <Card.Footer className="d-flex justify-content-between">
        <Pagination className="card-pagination pagination-tabs">
          <Pagination.Item
            className="ps-0 pe-4 border-end"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <FeatherIcon icon="arrow-left" size="1em" className="me-1" /> Prev
          </Pagination.Item>
        </Pagination>
        <Pagination className="card-pagination pagination-tabs">
          {props?.data?.map((option, index) => (
            <Pagination.Item
              key={index}
              active={page === option}
              onClick={() => setPage(option)}
            >
              {option + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        <Pagination className="card-pagination pagination-tabs">
          <Pagination.Item
            className="ps-4 pe-0 border-start"
            disabled={page === props?.data?.length - 1}
            onClick={() => setPage(page + 1)}
          >
            Next <FeatherIcon icon="arrow-right" size="1em" className="ms-1" />
          </Pagination.Item>
        </Pagination>
      </Card.Footer>
      {/* use as per your requirement */}
      <Pagination size="lg">
        <Pagination.Item>Previous</Pagination.Item>
        <Pagination.Item>1</Pagination.Item>
        <Pagination.Item>2</Pagination.Item>
        <Pagination.Item>3</Pagination.Item>
        <Pagination.Item>Next</Pagination.Item>
      </Pagination>
    </div>
  );
};

export default CustomPagination;
