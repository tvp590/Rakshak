import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useTheme } from "../../context/themeContext";
import Image from "next/image";

interface AlertModalProps {
  show: boolean;
  alert: any | null;
  onClose: () => void;
}

const AlertModal = ({ show, alert, onClose } : AlertModalProps) => {
  const { isDarkMode } = useTheme();

  if (!alert) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton style={{backgroundColor : isDarkMode ? "#343a40" : "#ffffff"}} closeVariant={isDarkMode ? "white" : "black"} >
        <Modal.Title>Alert Details</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
        }}
      >
        <Row>
          <Col xs={12} md={6}>
            <Image
              src={alert.image}
              alt="Alert"
              width={800}
              height={450}
              style={{
                borderRadius: "10px",
                marginBottom: "1rem",
                objectFit: "cover",
              }}
            />
          </Col>
          <Col xs={12} md={6}>
            <h5>{alert.description}</h5>
            <p>
              <strong>Time:</strong> {alert.time}
              <br />
              <strong>Location:</strong> {alert.location}
            </p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer style={{backgroundColor : isDarkMode ? "#343a40" : "#ffffff"}}>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
