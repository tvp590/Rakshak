import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Form, Alert } from "react-bootstrap";
import CCTVForm from "../components/modals/cctvFormModal";
import CCTVTable from "../components/tables/cctvTable";
import { GetServerSideProps } from "next";
import { CCTV } from "../types";
import axios from "axios";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";

const ManageCCTVs = () => {
  const [cctvs, setCCTVs] = useState<CCTV[] | null>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCCTV, setSelectedCCTV] = useState<CCTV | null>(null);
  const [searchIP, setSearchIP] = useState<string>("");
  const [searchCCTV, setSearchCCTV] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser(); 
  const router = useRouter();

  useEffect(() => {
    async function loadCCTVs() {
      try {
        const response = await axios.get("/api/cctv/all", {
          withCredentials: true
        });
        if (response.status === 200){
          setCCTVs(response.data);
          setLoading(false);
        } 
      } catch (err) {
        console.error(err);
        setError("Error fetching CCTV data.");
        setLoading(false);
      }
    }
    loadCCTVs();
  }, [user?.role]);

  useEffect(() => {
      if (user === null) {
        router.push('/login');
      }
    }, [router, user]);

  const handleAddNew = () => {
    setSelectedCCTV(null);
    setShowForm(true);
  };

  const handleEditCCTV = (cctv: CCTV) => {
    setSelectedCCTV(cctv);
    setShowForm(true);
  };

  const handleRemoveCCTV = async (cctvId: number) => {
    try {
      const response = await axios.delete(`/api/cctv/${cctvId}`,{withCredentials:true});
      if (response.status === 200) {
        setCCTVs((prevCCTVs) => 
          prevCCTVs ? prevCCTVs.filter((cctv) => cctv.id !== cctvId) : null
        );
      }
    } catch (error) {
      console.error("Error deleting CCTV:", error);
    }
  };

  const handleSubmit = async (data: CCTV) => {
    try {
      let response;
      if (selectedCCTV) {
        response = await axios.patch(`/api/cctv/${selectedCCTV.id}`, data, { withCredentials: true });
      } else {
        response = await axios.post("/api/cctv/register", data, { withCredentials: true });
      }

      if (response.status === 200 || response.status === 201) {
        const newCCTVs = await axios.get("/api/cctv/all", { withCredentials: true });
        setCCTVs(newCCTVs.data);
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error submitting CCTV:", error);
      setError("An error occurred while submitting the CCTV.");
    }
  };

  const filteredCCTVs = cctvs?.filter((cctv) => {
    const matchCCTV =
      searchCCTV === "" ||
      cctv.name.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      cctv.location.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      (cctv.username && cctv.username.toLowerCase().includes(searchCCTV.toLowerCase()));
  
    const matchIP =
      searchIP === "" || cctv.ip_address.toLowerCase().includes(searchIP.toLowerCase());
  
    return matchCCTV && matchIP;
  });

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Manage CCTVs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          <Row>
            <Col>
              <Button
                variant="primary"
                className="mb-3"
                onClick={handleAddNew}
                style={{ float: "right" }}
              >
                Add New CCTV
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="searchIP">
                <Form.Label>Search IP Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by Ip address"
                  value={searchIP}
                  onChange={(e) => setSearchIP(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="searchCCTV">
                <Form.Label>Search CCTV</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by CCTV name or location"
                  value={searchCCTV}
                  onChange={(e) => setSearchCCTV(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              {filteredCCTVs?.length ? (
                <CCTVTable
                  cctvs={filteredCCTVs}
                  searchCCTV={searchCCTV}
                  onEdit={handleEditCCTV}
                  onRemove={handleRemoveCCTV}
                />
              ) : (
                <p>No CCTVs found matching your search criteria.</p>
              )}
            </Col>
          </Row>

          {showForm && (
            <CCTVForm
              show={showForm}
              onHide={() => setShowForm(false)}
              onSubmit={handleSubmit}
              initialData={selectedCCTV}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default ManageCCTVs;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Manage CCTV - Rakshak",
    },
  };
};
