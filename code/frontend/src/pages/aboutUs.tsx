import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import { GetServerSideProps } from "next";

const AboutUs = () => {
  const { isDarkMode } = useTheme();

  const bgColor = isDarkMode ? "#1e1e1e" : "#ffffff";
  const textColor = isDarkMode ? "#f8f9fa" : "#212529";
  const cardBg = isDarkMode ? "#2c2c2c" : "#f8f9fa";

  return (
    <Container
      className="py-2"
      style={{ backgroundColor: bgColor, color: textColor, minHeight: "85vh" }}
    >
      <h1 className="text-center mb-4">About Us</h1>

      <Row className="mb-5">
        <Col md={10} lg={8} className="mx-auto">
          <p className="lead text-center">
            Rakshak is a next-generation AI-powered surveillance system, dedicated to enhancing public safety
            through real-time weapon detection and rapid alert response.
          </p>
        </Col>
      </Row>

      <Row className="g-4 justify-content-center">
        <Col md={6}>
          <Card
            className="h-100 shadow"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            <Card.Body>
              <Card.Title>🎯 Our Mission</Card.Title>
              <Card.Text>
                Our mission is to build safer communities by leveraging cutting-edge computer vision
                and artificial intelligence to detect threats in real time. We believe in proactive
                security that empowers response teams with instant and accurate situational awareness.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="h-100 shadow"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            <Card.Body>
              <Card.Title>🚀 How We’re Achieving It</Card.Title>
              <Card.Text>
                Rakshak integrates seamlessly with existing CCTV infrastructure to scan live video
                feeds for visible weapons. When a threat is detected, the system immediately sends
                alerts to the control room — complete with image snapshots, location metadata,
                and time stamps — enabling swift and informed decisions.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="h-100 shadow"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            <Card.Body>
              <Card.Title>🤝 Collaboration & Growth</Card.Title>
              <Card.Text>
              We are actively collaborating with law enforcement agencies, municipalities, and public sector institutions to roll out Rakshak in real-world environments. Through these partnerships, we are continuously improving system accuracy, performance, and adaptability based on real-time field data and feedback.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card
            className="h-100 shadow"
            style={{ backgroundColor: cardBg, color: textColor }}
          >
            <Card.Body>
              <Card.Title>🔒 Privacy First</Card.Title>
              <Card.Text>
                We are committed to protecting individual privacy. Rakshak never stores personal data,
                and all alerting is based solely on visual threat detection — not identity recognition.
                Security should never come at the cost of civil rights.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "About Us - Rakshak",
    },
  };
};
