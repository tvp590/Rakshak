import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useTheme } from "../../context/themeContext";
import CustomFormGroup from "../customFormGroup";
import { CCTV, CCTVFormProps, Role } from "../../types";
import { useUser } from "../../context/userContext";

const CCTVForm = ({
  show,
  onHide,
  onSubmit,
  initialData,
}: CCTVFormProps) => {
  const { isDarkMode } = useTheme();
  const { user } = useUser();
  const isSuperAdmin = user?.role === Role.SuperAdmin;

  const [formData, setFormData] = useState<CCTV>({
    name: initialData?.name || "",
    location: initialData?.location || "",
    username: initialData?.username || "",
    password: initialData?.password || "",
    ip_address: initialData?.ip_address || "",
    is_active : initialData?.is_active || false,
    id: initialData?.id || 0,
    institution_id : initialData?.institution_id || user?.institution_id || 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "is_active") {
      setFormData({ ...formData, [name]: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData); 
    onHide();  
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }}
        closeVariant={isDarkMode ? "white" : "black"}
      >
        <Modal.Title>
          {initialData ? "Update CCTV" : "Add New CCTV"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
        }}
      >
        <Form data-bs-theme={isDarkMode ? "dark" : "light"}>
          <CustomFormGroup
            name="name"
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter CCTV name"
            required
          />
          <CustomFormGroup
            name="location"
            label="Location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter CCTV location"
            required
          />
          <CustomFormGroup
            name="username"
            label="Username"
            type="text"
            value={formData.username || ""}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
          <CustomFormGroup
            name="password"
            label="Password"
            type="password"
            value={formData.password || ""}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
          <CustomFormGroup
            name="ip_address"
            label="IP Address"
            type="text"
            value={formData.ip_address}
            onChange={handleChange}
            placeholder="Enter IP address"
            required
          />
          <CustomFormGroup
            name="institution_id"
            label="Institution ID"
            type="text"
            value={formData.institution_id || 0}
            onChange={handleChange}
            placeholder="Institution ID"
            disabled={!isSuperAdmin} 
          />
          <Form.Group controlId="is_active" className="mb-3">
            <Form.Label>CCTV Active</Form.Label>
            <Form.Select
              name="is_active"
              value={formData.is_active.toString()}
              onChange={handleChange}
              className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-black"
              style={{
                transition: 'all 0.3s ease',
                backgroundColor: '#f8f9fa',
              }}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer
        style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }}
      >
        <Button variant="warning" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {initialData ? "Update" : "Add"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CCTVForm;
