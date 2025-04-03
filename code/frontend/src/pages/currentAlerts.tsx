import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button, Alert } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import AlertModal from "../components/modals/alertModal";
import { GetServerSideProps } from "next";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";
import { Alerts, Role } from "../types";
import SocketClient from "../components/SocketClient";
import axios from "axios";

const CurrentAlerts = () => {
  const { isDarkMode } = useTheme();
  const [selectedAlert, setSelectedAlert] = useState<Alerts | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alerts, setAlerts] = useState<Alerts[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); 
  const router = useRouter();
  const socket = SocketClient();

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
    else{
      fetchAlerts();
    }
  }, [router, user]);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(
        "/api/alert/active", {
          withCredentials: true
        }
      )

      if (response.status === 200){
        const newAlerts = response.data.alerts;
        setAlerts((prevAlerts) => {
          if (JSON.stringify(prevAlerts) !== JSON.stringify(newAlerts)) {
            return newAlerts;
          }
          return prevAlerts;
        });
      }
    }
    catch (err){
      console.error("Error fetching alerts:", err);
      setError("An error occurred while fetching active alerts");
    }
  }

  useEffect(() => {
    if (!socket) return;
    const handleWeaponAlert = (alertData: Alerts) => {
      console.log("🚨 Received weapon alert:", alertData);
      fetchAlerts();
    };
  
    socket.on("weapon_alert", handleWeaponAlert);
  
    return () => {
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

  const handleRejectAlert = async(alertId: number) => {
    try{
      const response = await axios.patch(
        `/api/alert/${alertId}`,
        {
          is_active : false 
        },
        {
          withCredentials: true,
        }
      )
      if (response.status === 200) {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
      }
    }
    catch (err) {
      console.error("Error rejecting alert:", err);
      setError("Failed to reject alert. Please try again.");
    }
  };

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4" style={{ color: isDarkMode ? "#f8f9fa" : "#212529" }}>
        Current Alerts
      </h2>
      {error ? (
          <Row>
            <Col className="text-center text-danger">
              <h5>{error}</h5>
            </Col>
          </Row>
        ) : 
        alerts.length > 0 ? (
          <Row className="g-3">
            {alerts.map((alert) => (
              <Col xs={12} md={6} lg={4} key={alert.id}>
                <Card
                  style={{
                    backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
                    color: isDarkMode ? "#f8f9fa" : "#212529",
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={`${process.env.NEXT_PUBLIC_URL}${alert.image_path.replace('./', '/')}`}
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
                    <Row className="g-2">
                      <Col xs="auto">
                        <Button variant="primary" onClick={() => handleViewAlert(alert)}>
                          View Details
                        </Button>
                      </Col>
                      {user?.role !== Role.User && (
                        <Col xs="auto">
                          <Button variant="danger" onClick={() => handleRejectAlert(alert.id)}>
                            Reject
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6} className="text-center">
              <Alert
                variant={isDarkMode ? "dark" : "light"}
                style={{
                  backgroundColor: isDarkMode ? "#495057" : "#f8f9fa",
                  color: isDarkMode ? "#f8f9fa" : "#212529",
                }}
              >
                <h5>No Current Alerts</h5>
                <p>All zones are currently secure. Keep up the good work!</p>
              </Alert>
            </Col>
          </Row>
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
