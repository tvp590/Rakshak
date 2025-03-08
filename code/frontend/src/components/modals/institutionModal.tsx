import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useTheme } from "../../context/themeContext";
import CustomFormGroup from "../customFormGroup";
import { Institution, InstitutionModalProps } from "../../types";

const InstitutionModal = ({
  show,
  onHide,
  onSave,
  institution,
} : InstitutionModalProps) => {
  const [formData, setFormData] = useState<Institution>({
    id: institution?.id || 0,
    name: institution?.name || "",
    address: institution?.address || "",
    email: institution?.email || "",
    phone: institution?.phone || "",
  });

  useEffect(() => {
    if (institution) {
      setFormData({
        id: institution.id,
        name: institution.name,
        address: institution.address,
        email: institution.email,
        phone: institution.phone
      });
    }
  }, [institution]);
  
  const {isDarkMode} = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }} closeVariant={isDarkMode ? "white" : "black"}>
        <Modal.Title>{institution ? "Edit Institution" : "Add Institution"}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
        }}
      >
        <Form
          data-bs-theme={isDarkMode ? "dark" : "light"}
        >
          <CustomFormGroup
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter institution name"
            required
          />
          <CustomFormGroup
            label ="Address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter institution address"
            required
          />
          <CustomFormGroup
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
          <CustomFormGroup
            label="Phone Number"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
          />
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }}
      >
        <Button variant="warning" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InstitutionModal;
