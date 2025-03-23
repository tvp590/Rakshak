import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import { GetServerSideProps } from "next";

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const bgColor = isDarkMode ? "#1e1e1e" : "#ffffff";
  const textColor = isDarkMode ? "#f8f9fa" : "#212529";
  const cardBg = isDarkMode ? "#2c2c2c" : "#f8f9fa";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to backend/email service
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <Container
      className="py-2"
      style={{ backgroundColor: bgColor, color: textColor, minHeight: "85vh" }}
    >
      <h1 className="text-center mb-4">Contact Us</h1>

      <Row className="mb-4">
        <Col md={8} className="mx-auto text-center">
          <p className="lead">
            Want to schedule a live demo? Interested in pricing or deploying Rakshak for your facility or home?
            We&apos;re here to help — just fill out the form below and our team will get back to you promptly.
          </p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div
            className="p-4 shadow rounded"
            style={{ backgroundColor: cardBg }}
          >
            {submitted && (
              <Alert variant="success" className="text-center">
                ✅ Thank you! We&apos;ll be in touch shortly.
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="message" className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  rows={4}
                  placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <div className="text-center">
                <Button type="submit" variant="primary">
                  Submit Inquiry
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Contact Us - Rakshak",
    },
  };
};
