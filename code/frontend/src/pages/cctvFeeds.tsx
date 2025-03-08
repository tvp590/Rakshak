import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import { GetServerSideProps } from "next";
import CCTVFeedCard from "../components/cctvFeedCard";
import { ActiveStreamsResponse, CCTVFeed, Role } from "../types";
import CCTVFeedModal from "../components/modals/displayCCTVFeedModal";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";
import axios from "axios";


const CCTVFeeds = () => {
  const { isDarkMode } = useTheme();
  const [selectedFeed, setSelectedFeed] = useState<CCTVFeed | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [cctvFeeds, setCctvFeeds] = useState<CCTVFeed[]>([]);
  const [startingStreams, setStartingStreams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); 
  const router = useRouter();
  // const { simulateAlert } = useWeaponAlert();

  // const handleTestAlert = () => {
  //   simulateAlert("Test Weapon Detected", { someDetail: "example" });
  // };

  
  useEffect(() => {
    const fetchCCTVFeeds = async () => {
      try {
        const response = await axios.get<ActiveStreamsResponse>("/api/stream/active-streams", {
          withCredentials: true
        });

        if (response.status === 200) {
          const data = response.data;
          if (data.active_streams && data.active_streams.length > 0) {
            setCctvFeeds(
              data.active_streams.map((stream,index) => ({
                id: stream.cctv_id,
                cameraName: `Camera ${index + 1}`,
                location: stream.location,
                streamURL: stream.stream_url,
              }))
            );
          } else{
            setError("No active CCTV streams found.");
          }
      } 
    }
      catch (err) {
        console.error(err); 
        setError("An error occurred while fetching streams.");
      } finally {
        setLoading(false);
      }
    };

    fetchCCTVFeeds();
  }, []);

  useEffect(() => {
    if (user === null) {
      router.push('/login');
    }
  }, [router, user]);

  const handleStartStreams = async () => {
    setStartingStreams(true);

    try {
      const response = await axios.post(
        "/api/stream/start-streams",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setError(null);
        setCctvFeeds([]); 
        window.location.reload(); 
      } else {
        setError("Failed to start streams.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while starting streams.");
    } finally {
      setStartingStreams(false);
    }
  };

  const handleStopStreams = async () => {
    setStartingStreams(true);
  
    try {
      const response = await axios.post(
        "/api/stream/stop-streams",
        {},
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        setCctvFeeds([]);
        window.location.reload();
      } else {
        setError("Failed to stop streams.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while stopping streams.");
    } finally {
      setStartingStreams(false);
    }
  };
  
  const handleViewFeed = (feed: CCTVFeed) => {
    setSelectedFeed(feed);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFeed(null);
    setShowModal(false);
  };

  return (
    <Container className="py-3">
      <h2 className="text-center mb-4" style={{ color: isDarkMode ? "#f8f9fa" : "#212529" }}>
        CCTV Feeds
      </h2>
      {/* <WeaponAlertNotification />
      <button onClick={handleTestAlert}>Simulate Alert</button> */}

      {loading ? (
        <p className="text-center">Loading CCTV feeds...</p>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          {user?.role != Role.User && (
            <Row className="mb-3 d-flex justify-content-start"> {/* Flexbox for left alignment */}
              <Col xs="auto">
                <Button
                  variant={cctvFeeds.length > 0 ? "danger" : "primary"}
                  onClick={cctvFeeds.length > 0 ? handleStopStreams : handleStartStreams}
                >
                  {startingStreams ? (
                    <Spinner size="sm" animation="border" />
                  ) : cctvFeeds.length > 0 ? (
                    "Stop Streaming"
                  ) : (
                    "Start Streaming"
                  )}
                </Button>
              </Col>
            </Row>
          )}

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
        </>
      )}

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

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "CCTV Feeds - Rakshak",
    },
  };
};
