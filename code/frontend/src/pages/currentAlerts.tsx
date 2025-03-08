import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import AlertModal from "../components/modals/alertModal";
import { GetServerSideProps } from "next";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";
import { Alerts } from "../types";
import SocketClient from "../components/SocketClient";

const CurrentAlerts = () => {
  const { isDarkMode } = useTheme();
  const [selectedAlert, setSelectedAlert] = useState<Alerts | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alerts, setAlerts] = useState<Alerts[]>([]);
  const { user } = useUser(); 
  const router = useRouter();
  const socket = SocketClient();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  useEffect(() => {
    if (!socket) return;
    const handleWeaponAlert = (alertData: Alerts) => {
      console.log("🚨 Received weapon alert:", alertData);
      setAlerts((prevAlerts) => [{ ...alertData, created_at: new Date().toLocaleString() }, ...prevAlerts]);
    };
  
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
  
    socket.on("weapon_alert", handleWeaponAlert);
  
    return () => {
      socket.off("connect");
      socket.off("weapon_alert", handleWeaponAlert);
    };
  }, [socket]);
  

  const handleViewAlert = (alert: Alerts) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setShowModal(false);
  };

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4" style={{ color: isDarkMode ? "#f8f9fa" : "#212529" }}>
        Current Alerts
      </h2>
      {alerts.length > 0 ? (
        <Row className="g-3">
          {alerts.map((alert, index) => (
            <Col xs={12} md={6} lg={4} key={index}>
              <Card
                style={{
                  backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
                  color: isDarkMode ? "#f8f9fa" : "#212529",
                }}
              >
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${alert.processed_frame}`}
                  alt="Weapon detected"
                />
                <Card.Body>
                  <Card.Title>{alert.weapon_type}</Card.Title>
                  <Card.Text>
                    <strong>Time:</strong> {alert.created_at}
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Current Alerts - Rakshak",
    },
  };
};
