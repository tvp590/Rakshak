// pages/AlertHistory.tsx
import React, { useState } from "react";
import { Container, Table, Button, Alert, Form, Col, Row } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import AlertModal from "../components/modals/alertModal";
import { GetStaticProps } from "next";

const AlertHistory = () => {
  const { isDarkMode } = useTheme();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  const handleViewAlert = (alert: any) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setShowModal(false);
  };

  const alertsHistory = [
    {
      id: 1,
      image: "/placeholder.jpg",
      description: "Weapon detected in Zone A at 10:30 AM.",
      time: "10:30 AM",
      location: "Zone A",
      resolution: "Resolved at 11:00 AM by Officer John.",
    },
    {
      id: 2,
      image: "/placeholder.jpg",
      description: "Unauthorized entry detected in Zone C at 11:15 AM.",
      time: "11:15 AM",
      location: "Zone C",
      resolution: "Resolved at 11:45 AM by Officer Sarah.",
    },
  ];

  const filteredAlerts = alertsHistory.filter(
    (alert) =>
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDate ? alert.time.includes(selectedDate) : true)
  );

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4" style={{ color: isDarkMode ? "#f8f9fa" : "#212529" }}>
        Alert History
      </h2>

      {/* Filters */}
      <Form className="mb-4">
        <Row>
          <Form.Group as={Col} controlId="search">
            <Form.Control
              type="text"
              placeholder="Search by description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="dateFilter">
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </Row>
      </Form>

      {filteredAlerts.length > 0 ? (
        <Table striped bordered hover responsive variant={isDarkMode ? "dark" : "light"}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Time</th>
              <th>Location</th>
              <th>Resolution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alert) => (
              <tr key={alert.id}>
                <td>{alert.id}</td>
                <td>{alert.description}</td>
                <td>{alert.time}</td>
                <td>{alert.location}</td>
                <td>{alert.resolution}</td>
                <td>
                  <Button variant="primary" onClick={() => handleViewAlert(alert)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert
          variant={isDarkMode ? "dark" : "light"}
          className="text-center"
          style={{
            backgroundColor: isDarkMode ? "#495057" : "#f8f9fa",
            color: isDarkMode ? "#f8f9fa" : "#212529",
          }}
        >
          <h5>No Alert History</h5>
          <p>No alerts have been recorded yet. Stay vigilant!</p>
        </Alert>
      )}

      <AlertModal show={showModal} alert={selectedAlert} onClose={handleCloseModal} />
    </Container>
  );
};

export default AlertHistory;

export const getStaticProps : GetStaticProps = async () => {
    return {
      props: {
        pageTitle: "Alert History - Rakshak",
      },
    };
};