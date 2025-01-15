import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Form } from "react-bootstrap";
import CCTVForm from "../components/modals/cctvFormModal";
import CCTVTable from "../components/tables/cctvTable";
import { GetStaticProps } from "next";

const ManageCCTVs = ({ role, adminId }: { role: string; adminId: number }) => {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCCTV, setSelectedCCTV] = useState<any>(null);
  const [searchInstitute, setSearchInstitute] = useState<string>("");
  const [searchCCTV, setSearchCCTV] = useState<string>("");

  useEffect(() => {
    async function loadCCTVs() {
      const data = [
        {
          id: 1,
          name: "Institution 1",
          cctvs: [
            {
              id: 1,
              name: "CCTV 1",
              location: "Main Entrance",
              ip: "10.10.10.10",
              password: "password",
              username: "admin",
            },
            {
              id: 2,
              name: "CCTV 2",
              location: "Parking Lot",
              ip: "10.10.10.11",
              password: "password2",
              username: "admin",
            },
          ],
        },
        {
          id: 2,
          name: "Institution 2",
          cctvs: [
            {
              id: 3,
              name: "CCTV 3",
              location: "Main Entrance1",
              ip: "11.11.11.11",
              password: "password3",
              username: "admin3",
            },
            {
              id: 4,
              name: "CCTV 4",
              location: "Parking Lot2",
              ip: "11.11.11.12",
              password: "password4",
              username: "admin2",
            },
          ],
        },
      ];
      setInstitutions(data);
    }
    loadCCTVs();
  }, [role, adminId]);

  const handleAddNew = () => {
    setSelectedCCTV(null);
    setShowForm(true);
  };

  const handleEditCCTV = (cctv: any) => {
    setSelectedCCTV(cctv);
    setShowForm(true);
  };

  const handleRemoveCCTV = (cctvId: number) => {
    console.log("Removing CCTV ID:", cctvId);
    // Implement API call to remove CCTV
  };

  const filteredInstitutions = institutions.filter((institution) =>
    institution.name.toLowerCase().includes(searchInstitute.toLowerCase())
  );

  const filteredCCTVs = filteredInstitutions.map((institution) => {
    const filteredCCTVsForInstitution = institution.cctvs.filter((cctv) =>
      cctv.name.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      cctv.location.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      cctv.ip.includes(searchCCTV.toLowerCase()) ||
      cctv.username.toLowerCase().includes(searchCCTV.toLowerCase())
    );
    return {
      ...institution,
      cctvs: filteredCCTVsForInstitution,
    };
  }); 

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Manage CCTVs</h2>
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
          <Form.Group controlId="searchInstitute">
            <Form.Label>Search Institute</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by institute name"
              value={searchInstitute}
              onChange={(e) => setSearchInstitute(e.target.value)}
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
          {filteredCCTVs && filteredCCTVs.map((institution) => (
            <div key={institution.id} className="mb-5">
                <h4>{institution.name}</h4>
                {institution.cctvs.length > 0 ? (
                    <CCTVTable
                        cctvs={institution.cctvs}
                        searchCCTV={searchCCTV}
                        onEdit={handleEditCCTV}
                        onRemove={handleRemoveCCTV}
                    />
                ) : (
                    <p>No CCTVs match the search criteria for this institution.</p>
                )}
            </div>
          ))}
        </Col>
      </Row>

      {showForm && (
        <CCTVForm
          show={showForm}
          onHide={() => setShowForm(false)}
          onSubmit={(data: any) => console.log("Form Submitted:", data)}
          initialData={selectedCCTV}
        />
      )}
    </Container>
  );
};

export default ManageCCTVs;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "Manage CCTV - Rakshak",
    },
  };
};
