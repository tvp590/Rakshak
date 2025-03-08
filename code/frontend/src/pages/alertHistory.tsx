import React, { useState, useEffect } from "react";
import { Container, Alert, Form, Col, Row } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import AlertModal from "../components/modals/alertModal";
import axios from "axios";
import { Alerts } from "../types"; 
import AlertsTable from "../components/tables/alertsTable";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const AlertHistory = () => {
  const { isDarkMode } = useTheme();
  const [selectedAlert, setSelectedAlert] = useState<Alerts | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [alertsHistory, setAlertsHistory] = useState<Alerts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); 
  const router = useRouter();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get("/api/alert/all");
        setAlertsHistory(response.data);
        setLoading(false);
      } catch (err : unknown) {
        console.log(err)
        setError("Error fetching alerts.");
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

    useEffect(() => {
      if (user === null) {
        router.push('/login');
      }
    }, [router, user]);

  const handleViewAlert = (alert: Alerts) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setShowModal(false);
  };

  const filteredAlerts = alertsHistory.filter(
    (alert) =>
      alert.weapon_type.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDate ? alert.created_at.includes(selectedDate) : true)
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
              placeholder="Search by weapon type"
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

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : filteredAlerts.length > 0 ? (
        <AlertsTable
          alerts={filteredAlerts}
          onViewAlert={handleViewAlert}
          isDarkMode={isDarkMode}
        />
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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Alert History - Rakshak",
    },
  };
};