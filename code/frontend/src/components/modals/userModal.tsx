import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import CustomFormGroup from "../customFormGroup";
import { useTheme } from "../../context/themeContext";

interface UserModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (user: any) => void;
  user: any | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  formData: {
    name: string;
    email: string;
    password: string;
    role: string;
    institution:string;
  };
}

const UserModal = ({ show, onHide, onSave, user, handleChange, formData }: UserModalProps) => {
  const {isDarkMode} = useTheme();
  const handleSave = () => {
    onSave({ ...formData, user_id: user?.user_id });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }} closeVariant={isDarkMode ? "white" : "black"}>
        <Modal.Title>{user ? "Edit User" : "Add User"}</Modal.Title>
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
            placeholder="Enter name"
            required
          />
          <CustomFormGroup
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
          <CustomFormGroup
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
          <CustomFormGroup
            label="Institution"
            name ="institution"
            type="text"
            value={formData.institution}
            onChange={handleChange}
            placeholder="Enter institution"
          />
          <Form.Group controlId="formRole" className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-black"
              style={{
                transition: 'all 0.3s ease',
                backgroundColor: '#f8f9fa',
              }}
            >
              <option value="">Select Role</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Site Admin">Site Admin</option>
              <option value="User">User</option>
            </Form.Select>
          </Form.Group>
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

export default UserModal;
