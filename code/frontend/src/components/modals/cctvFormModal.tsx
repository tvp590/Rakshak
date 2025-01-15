import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { useTheme } from "../../context/themeContext";
import CustomFormGroup from "../customFormGroup";


interface CCTVFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const CCTVForm = ({
  show,
  onHide,
  onSubmit,
  initialData,
}: CCTVFormProps) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState(
    initialData || { name: "", location: "", username: "", password: "", ip: "" }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter CCTV name"
            required
          />
          <CustomFormGroup
            label="Location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter CCTV location"
            required
          />
          <CustomFormGroup
            label="Username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
          <CustomFormGroup
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
          <CustomFormGroup
            label="IP Address"
            type="text"
            value={formData.ip}
            onChange={handleChange}
            placeholder="Enter IP address"
            required
          />
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
