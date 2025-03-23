import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { useTheme } from "../../context/themeContext";
import Image from "next/image";
import { AlertModalProps } from "../../types";

const AlertModal = ({ show, alert, onClose }: AlertModalProps) => {
  const { isDarkMode } = useTheme();

  if (!alert) return null;

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
        }}
        closeVariant={isDarkMode ? "white" : "black"}
      >
        <Modal.Title>Alert Details</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
        }}
      >
        <Row className="g-3">
          <Col xs={12} md={6}>
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_URL}${alert.image_path.replace('.', '')}`}
                alt="Alert"
                layout="responsive"
                width={500}
                height={300}
                objectFit="cover"
                unoptimized
              />
            </div>
          </Col>
          <Col xs={12} md={6}>
            <div className="d-flex flex-column gap-2">
              <p><strong>Time:</strong> {alert.created_at}</p>
              <p><strong>Location:</strong> {alert.location}</p>
              <p><strong>Weapon Type:</strong> {alert.weapon_type}</p>
              <p><strong>Camera ID:</strong> {alert.cctv_id}</p>
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }}>
        <Button variant="primary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
