import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import { GetStaticProps } from "next";
import CCTVFeedModal from "../components/modals/displayCCTVFeedModal";
import CCTVFeedCard from "../components/cctvFeedCard";

const CCTVFeeds = () => {
  const { isDarkMode } = useTheme();
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewFeed = (feed: any) => {
    setSelectedFeed(feed);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFeed(null);
    setShowModal(false);
  };

  const cctvFeeds = [
    {
      id: 1,
      cameraName: "Camera 1",
      location: "Main Entrance",
      feedUrl: "/feed1.jpg",
      alert: false, 
    },
    {
      id: 2,
      cameraName: "Camera 2",
      location: "Parking Lot",
      feedUrl: "/feed2.jpg",
      alert: false,
    },
    {
      id: 3,
      cameraName: "Camera 3",
      location: "Building Corridor",
      feedUrl: "/feed3.jpg",
      alert: true,
    },
  ];

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4" style={{ color: isDarkMode ? "#f8f9fa" : "#212529" }}>
        CCTV Feeds
      </h2>

      <Row>
        {cctvFeeds.map((feed) => (
          <CCTVFeedCard
            key={feed.id}
            feed={feed}
            isDarkMode={isDarkMode}
            onClick={() => handleViewFeed(feed)}
          />
        ))}
      </Row>

      <CCTVFeedModal
        showModal={showModal}
        selectedFeed={selectedFeed}
        handleCloseModal={handleCloseModal}
        isDarkMode={isDarkMode}
      />
    </Container>
  );
};

export default CCTVFeeds;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "CCTV Feeds - Rakshak",
    },
  };
};
