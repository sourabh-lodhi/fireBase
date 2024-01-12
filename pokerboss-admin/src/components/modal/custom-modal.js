'use client';
import { Modal } from 'react-bootstrap';
import React from 'react';

const CustomModal = (props) => {
  const {
    isError,
    header,
    bodyContent,
    isModalVisible,
    fromResetPassword,
    resetLink,
    onDismiss,
  } = props || {};
  return (
    <>
      <Modal show={isModalVisible} onHide={onDismiss} centered>
        <Modal.Header closeButton>
          <h6 className={isError ? 'text-danger' : 'text-dark'}>{header}</h6>
        </Modal.Header>

        <Modal.Body>
          <p>{bodyContent}</p>
          {fromResetPassword ? <a href={resetLink}>{resetLink}</a> : null}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
