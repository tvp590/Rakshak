import React, { useEffect, useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Hls from "hls.js";
import { CCTVFeedModalProps } from "../../types";

const CCTVFeedModal = ({ showModal, selectedFeed, handleCloseModal, isDarkMode }: CCTVFeedModalProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!selectedFeed?.streamURL || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 6,
        manifestLoadingTimeOut: 5000,
        manifestLoadingMaxRetry: 10,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(selectedFeed.streamURL);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.error("Video play error:", err));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS.js Error:", data);
        if (data.fatal && hls) {
          hls.destroy();
          hls = null;
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = selectedFeed.streamURL;
      video.play().catch(err => console.error("Native HLS play error:", err));
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [selectedFeed]);

  return (
    <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header
        closeButton
        style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }}
        closeVariant={isDarkMode ? "white" : "black"}
      >
        <Modal.Title>CCTV Feed Details</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          backgroundColor: isDarkMode ? "#343a40" : "#ffffff",
          color: isDarkMode ? "#f8f9fa" : "#212529",
        }}
      >
        {selectedFeed && (
          <>
            <div className="text-center">
              <video
                ref={videoRef}
                controls
                autoPlay
                style={{ borderRadius: "10px", maxWidth: "100%", width: "800px", height: "550px" }}
              />
            </div>
            <div className="mt-3">
              <h5>{`Camera ${selectedFeed.id}`}</h5>
              <p>
                <strong>Location:</strong> {selectedFeed.location}
              </p>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }}>
        <Button variant="primary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CCTVFeedModal;
