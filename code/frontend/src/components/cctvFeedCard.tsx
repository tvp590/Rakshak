import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container } from "react-bootstrap";
import Hls from "hls.js";
import { CCTVFeedCardProps } from "../types";

const CCTVFeedCard = ({ feed, isDarkMode, onClick }: CCTVFeedCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamURL, setStreamURL] = useState<string>(feed.streamURL);
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(false); // Track autoplay state

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    let hls: Hls | null = null;

    // Function to initialize HLS
    const initializeHLS = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 6,
          manifestLoadingTimeOut: 5000,
          manifestLoadingMaxRetry: 10,
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(streamURL); // Use dynamic streamURL
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("Manifest parsed, starting playback...");
          if (!isAutoplaying) {
            videoElement.play(); // Only autoplay if it's not already playing
            setIsAutoplaying(true);
          }
        });

        // Handle Automatic Reconnection
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.warn("Network error, retrying...");
                hls?.startLoad(); // Retry loading the stream
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.warn("Media error, recovering...");
                hls?.recoverMediaError(); // Attempt recovery
                break;
              default:
                console.warn("Destroying HLS, retrying...");
                hls?.destroy();
                setTimeout(initializeHLS, 3000); // 🔄 Reinitialize after 3s
                break;
            }
          }
        });
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = streamURL; // Use dynamic streamURL for native support
        videoElement.addEventListener("loadedmetadata", () => {
          console.log("Loaded metadata, starting playback...");
          if (!isAutoplaying) {
            videoElement.play(); // Only autoplay if it's not already playing
            setIsAutoplaying(true);
          }
        });
      }
    };

    // Initialize HLS with the dynamic URL
    initializeHLS();

    // Cleanup
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamURL, isAutoplaying]); // Depend on streamURL to reload the stream if it changes

  useEffect(() => {
    // Fetch the updated playlist periodically
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/streams/${feed.id}/playlist.m3u8`);
        if (response.ok) {
          // If the playlist has been updated (status 200), update the stream URL
          if (response.status === 200) {
            setStreamURL(`/streams/${feed.id}/playlist.m3u8`); // Update the stream URL to trigger HLS player reload
          }
        } else {
          console.error("Failed to fetch updated playlist:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching updated playlist:", error);
      }
    }, 5000); // Check every 5 seconds (adjust as needed)

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [feed.id]); // Fetch playlist based on feed.id

  return (
    <Col xs={12} md={6} lg={4} key={feed.id} className="mb-4">
      <Card
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
          borderColor: "#ccc",
          borderWidth: "2px",
        }}
        onClick={onClick}
      >
        <Card.Body>
          <Container fluid className="d-flex justify-content-center align-items-center">
            <video
              ref={videoRef}
              height={225}
              style={{
                borderRadius: "10px",
                objectFit: "cover",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                width: "100%",
                height: "auto",
                minWidth: "300px",
                minHeight: "400px",
                maxWidth: "100%",
                maxHeight: "700px",
              }}
              autoPlay
              muted
              playsInline
              controls
              preload="none"
            />
          </Container>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default CCTVFeedCard;
