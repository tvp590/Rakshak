import React from "react";
import { Modal, Button, Image } from "react-bootstrap";

interface CCTVFeedModalProps {
  showModal: boolean;
  selectedFeed: any;
  handleCloseModal: () => void;
  isDarkMode: boolean;
}

const CCTVFeedModal= ({ showModal, selectedFeed, handleCloseModal, isDarkMode } : CCTVFeedModalProps) => {
  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      size="lg"
      centered
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton style={{ backgroundColor: isDarkMode ? "#343a40" : "#ffffff" }} closeVariant={isDarkMode ? "white" : "black"}>
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
              <Image
                src={selectedFeed.feedUrl}
                alt={selectedFeed.cameraName}
                width={800}
                height={450}
                style={{
                  borderRadius: "10px",
                  objectFit: "cover",
                  maxWidth: "100%",
                }}
              />
            </div>
            <div className="mt-3">
              <h5>{selectedFeed.cameraName}</h5>
              <p>
                <strong>Location:</strong> {selectedFeed.location}
              </p>
              {selectedFeed.alert && <p className="text-danger">Alert Detected!</p>}
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
