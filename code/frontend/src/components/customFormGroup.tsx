import React from 'react';
import { Form } from 'react-bootstrap';

interface CustomFormGroupProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
}

const CustomFormGroup = ({
  label,
  type,
  value,
  name,
  onChange,
  placeholder,
  required = false,
} : CustomFormGroupProps) => {
  return (
    <Form.Group className="mb-2" controlId={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={value}
        name={name} 
        onChange={onChange}
        placeholder={placeholder}
        required={required}
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
