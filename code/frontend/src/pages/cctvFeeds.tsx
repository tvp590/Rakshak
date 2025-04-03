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
import { useWeaponAlert } from "../context/WeaponAlertContext";
import SocketClient from "../components/SocketClient";

const CCTVFeeds = () => {
  const { isDarkMode } = useTheme();
  const [selectedFeed, setSelectedFeed] = useState<CCTVFeed | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleFeeds, setVisibleFeeds] = useState<CCTVFeed[]>([]);
  const [startingStreams, setStartingStreams] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const { highlightedFeedId } = useWeaponAlert();
  const socket = SocketClient();

  useEffect(() => {
    const fetchCCTVFeeds = async () => {
      try {
        const response = await axios.get<ActiveStreamsResponse>("/api/stream/active-streams", {
          withCredentials: true,
        });

        const data = response.data;
        const feeds =
          data.active_streams?.map((stream, index) => ({
            id: stream.cctv_id,
            cameraName: `Camera ${index + 1}`,
            location: stream.location,
            streamURL: stream.stream_url,
          })) || [];

        setVisibleFeeds(feeds);
        setIsStreaming(feeds.length > 0);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching CCTV feeds.");
      } finally {
        setLoading(false);
      }
    };

    fetchCCTVFeeds();
  }, []);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [router, user]);

  useEffect(() => {
    if (!socket) return;

    const handleStreamStatus = async () => {
      try {
        const response = await axios.get<ActiveStreamsResponse>("/api/stream/active-streams", {
          withCredentials: true,
        });

        const data = response.data;
        const feeds =
          data.active_streams?.map((stream, index) => ({
            id: stream.cctv_id,
            cameraName: `Camera ${index + 1}`,
            location: stream.location,
            streamURL: stream.stream_url,
          })) || [];

        setVisibleFeeds(feeds);
        setIsStreaming(feeds.length > 0);
        setStartingStreams(false);
      } catch (err) {
        console.error("Error updating stream status via socket:", err);
        setError("Failed to sync stream status.");
        setStartingStreams(false);
      }
    };

    socket.on("stream_status", handleStreamStatus);
    return () => {
      socket.off("stream_status", handleStreamStatus);
    };
  }, [socket]);

  const handleStartStreams = async () => {
    setStartingStreams(true);
    try {
      const response = await axios.post("/api/stream/start-streams", {}, { withCredentials: true });
      if (response.status !== 200) {
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
      const response = await axios.post("/api/stream/stop-streams", {}, { withCredentials: true });
      if (response.status !== 200) {
        setError("Failed to stop streams.");
      }
      setVisibleFeeds([]);
      setIsStreaming(false);
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
  
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" size="sm" className="me-2" />
          <span>Loading CCTV feeds...</span>
        </div>
      ) : startingStreams ? (
        <div className="text-center mt-2">
          <Spinner animation="border" role="status" size="sm" className="me-2" />
          <span>Starting streams...</span>
        </div>
      ) : (
        <>
          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}
  
          {user?.role !== Role.User && (
            <Row className="mb-3 d-flex justify-content-start">
              <Col xs="auto">
                <Button
                  variant={isStreaming ? "danger" : "primary"}
                  onClick={isStreaming ? handleStopStreams : handleStartStreams}
                  disabled={startingStreams}
                >
                  {startingStreams ? (
                    <Spinner size="sm" animation="border" />
                  ) : isStreaming ? (
                    "Stop Streaming"
                  ) : (
                    "Start Streaming"
                  )}
                </Button>
              </Col>
            </Row>
          )}
  
          {visibleFeeds.length === 0 && !startingStreams && (
            <Alert variant="secondary" className="text-center">
              {user?.role === Role.User ? (
                <>No active CCTV streams available at the moment.</>
              ) : (
                <>
                  No active CCTV streams found.
                  <br />
                  You can start streaming by pressing the <strong>Start Streaming</strong> button.
                </>
              )}
            </Alert>
          )}
  
          <Container
            fluid
            className="mt-3"
            style={{
              display: visibleFeeds.length === 0 ? "none" : "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              justifyContent: "center",
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            {visibleFeeds.map((feed) => (
              <div key={feed.id}>
                <CCTVFeedCard
                  feed={feed}
                  isDarkMode={isDarkMode}
                  onClick={() => handleViewFeed(feed)}
                  highlight={feed.id === highlightedFeedId}
                />
              </div>
            ))}
          </Container>
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