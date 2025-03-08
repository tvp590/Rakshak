import React from 'react';
import { Form } from 'react-bootstrap';
import { CustomFormGroupProps } from '../types';

const CustomFormGroup = ({
  label,
  type,
  value,
  name,
  onChange,
  placeholder,
  required = false,
  disabled = false,
} : CustomFormGroupProps) => {
  return (
    <Form.Group className="mb-2" controlId={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={value ?? ''}
        name={name} 
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-dark"
        style={{
          transition: 'all 0.3s ease', 
          backgroundColor: '#f8f9fa',
        }}
      />
    </Form.Group>
  );
};

export default CustomFormGroup;
