import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";
import Hls from "hls.js";
import { CCTVFeedCardProps } from "../types";

const CCTVFeedCard = ({ feed, isDarkMode, onClick, highlight}: CCTVFeedCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamURL, setStreamURL] = useState<string>(feed.streamURL);
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(false);

  useEffect(() => {
    if (!videoRef.current) return;
    const videoElement = videoRef.current;
    let hls: Hls | null = null;

    const initializeHLS = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 6,
          manifestLoadingTimeOut: 5000,
          manifestLoadingMaxRetry: 10,
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(streamURL);
        hls.attachMedia(videoElement);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!isAutoplaying) {
            videoElement.play();
            setIsAutoplaying(true);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls?.recoverMediaError();
                break;
              default:
                hls?.destroy();
                setTimeout(initializeHLS, 3000);
                break;
            }
          }
        });
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        videoElement.src = streamURL;
        videoElement.addEventListener("loadedmetadata", () => {
          if (!isAutoplaying) {
            videoElement.play();
            setIsAutoplaying(true);
          }
        });
      }
    };

    initializeHLS();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamURL, isAutoplaying]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(`/streams/${feed.id}/playlist.m3u8`);
        if (response.ok) {
          setStreamURL(`/streams/${feed.id}/playlist.m3u8`);
        }
      } catch (error) {
        console.error("Error fetching updated playlist:", error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [feed.id]);

  return (
      <Card
      className={`shadow-sm border-2 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"} ${
        highlight ? "border-danger" : "border-secondary"
      }`}
        onClick={onClick}
        style={{ cursor: "pointer", transition: "transform 0.2s ease-in-out" }}
      >
        <div className="ratio ratio-16x9">
          <video
            ref={videoRef}
            className="w-100 h-100 rounded-top"
            style={{
              objectFit: "cover",
            }}
            autoPlay
            muted
            playsInline
            controls
            preload="none"
          />
        </div>
        <Card.Body className="py-2 px-3">
          <Card.Title className="mb-1 fs-6">{feed.cameraName}</Card.Title>
          <Card.Text className="mb-0" style={{ fontSize: "0.85rem" }}>
            {feed.location}
          </Card.Text>
        </Card.Body>
      </Card>
    );
};

export default CCTVFeedCard;
