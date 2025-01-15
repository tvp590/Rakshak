import React from "react";
import { Card, Col, Container } from "react-bootstrap";

interface CCTVFeedCardProps {
  feed: any;
  isDarkMode: boolean;
  onClick: () => void;
}

const CCTVFeedCard = ({ feed, isDarkMode, onClick } : CCTVFeedCardProps) => {
  return (
    <Col xs={12} md={6} lg={4} key={feed.id} className="mb-4">
      <Card
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
          borderColor: feed.alert ? "red" : "#ccc",
          borderWidth: feed.alert ? "2px" : "2px",
        }}
        onClick={onClick}
      >
        <Card.Body>
          <Container fluid className="d-flex justify-content-center align-items-center">
            <video
              src={feed.feedUrl}
              height={225}
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                width: "100%",
                height: "auto",
                minHeight: "250px",
                maxWidth: "100%",
                maxHeight: "500px",
              }}
              autoPlay
              muted
              playsInline
              controls
              preload="none"
            />
          </Container>
          <Card.Title className="mt-3">{feed.cameraName}</Card.Title>
          <Card.Text>{feed.location}</Card.Text>
          <span
            className={`text-danger ${feed.alert ? "opacity-100" : "opacity-0"}`}
            style={{ transition: "opacity 0.3s ease" }}
          >
            Alert Detected!
          </span>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CCTVFeedCard;
