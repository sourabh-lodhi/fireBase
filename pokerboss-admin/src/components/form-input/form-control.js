import React from "react";
import { Form } from "react-bootstrap";

export default function FormControl({
  label,
  value,
  disabled,
  type,
  onChange,
  placeholder,
}) {
  return (
    <>
      {label?.length ? <Form.Label>{label}</Form.Label> : null}
      {value !== undefined ? (
        <Form.Control
          value={value}
          disabled={disabled}
          type={type || "text"}
          onChange={(event) => onChange(event)}
          placeholder={placeholder}
        />
      ) : null}
    </>
  );
}
