import React, { useState } from "react";
import { Card, Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import AlertModal from "../components/modals/alertModal";
import { GetStaticProps } from "next";

const CurrentAlerts = () => {
  const { isDarkMode } = useTheme();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewAlert = (alert: any) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setShowModal(false);
  };

  const alerts = [
    {
      id: 1,
      image: "/placeholder.jpg",
      description: "Weapon detected in Zone A at 10:30 AM.",
      time: "10:30 AM",
      location: "Zone A",
    },
    {
      id: 2,
      image: "/placeholder.jpg",
      description: "Unauthorized entry detected in Zone C at 11:15 AM.",
      time: "11:15 AM",
      location: "Zone C",
    },
  ];

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4" style={{ color: isDarkMode ? "#f8f9fa" : "#212529" }}>
        Current Alerts
      </h2>
      {alerts.length > 0 ? (
        <Row className="g-3">
          {alerts.map((alert) => (
            <Col xs={12} md={6} lg={4} key={alert.id}>
              <Card
                style={{
                  backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
                  color: isDarkMode ? "#f8f9fa" : "#212529",
                }}
              >
                <Card.Img variant="top" src={alert.image} alt="Alert" />
                <Card.Body>
                  <Card.Title>{alert.description}</Card.Title>
                  <Card.Text>
                    <strong>Time:</strong> {alert.time}
                    <br />
                    <strong>Location:</strong> {alert.location}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button variant="primary" onClick={() => handleViewAlert(alert)}>
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert
          variant={isDarkMode ? "dark" : "light"}
          className="text-center"
          style={{
            backgroundColor: isDarkMode ? "#495057" : "#f8f9fa",
            color: isDarkMode ? "#f8f9fa" : "#212529",
          }}
        >
          <h5>No Current Alerts</h5>
          <p>All zones are currently secure. Keep up the good work!</p>
        </Alert>
      )}

      <AlertModal show={showModal} alert={selectedAlert} onClose={handleCloseModal} />
    </Container>
  );
};

export default CurrentAlerts;

export const getStaticProps : GetStaticProps = async () => {
    return {
      props: {
        pageTitle: "Current Alerts - Rakshak",
      },
    };
  };
