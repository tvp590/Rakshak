import React, { useEffect, useState } from "react";
import { Button, InputGroup, Form, Container, Row, Col } from "react-bootstrap";
import InstitutionTable from "../components/tables/institutionTable";
import InstitutionModal from "../components/modals/institutionModal";
import { useTheme } from "../context/themeContext";
import { GetServerSideProps } from "next";
import { Institution } from "../types";
import { useUser } from "../context/userContext";
import { useRouter } from "next/router";
import axios from "axios";

const InstitutionManagement = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const { isDarkMode } = useTheme(); 
  const { user } = useUser(); 
  const router = useRouter();

  useEffect(() => {
      if (user === null) {
        router.push('/login');
      } 
      else{
        fetchInstitutions(); 
      }
    }, [router, user]);

    const fetchInstitutions = async () => {
      try {
        const response = await axios.get("/api/institution/all", { withCredentials: true });
        if (response.status == 200){
          setInstitutions(response.data);
        }
      } catch (error) {
        console.error("Error fetching institutions", error);
      }
    };

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(search.toLowerCase()) ||
      institution.address.toLowerCase().includes(search.toLowerCase()) ||
      institution.email.toLowerCase().includes(search.toLowerCase()) ||
      institution.phone.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddInstitution = () => {
    setShowModal(true);
    setSelectedInstitution(null);
  };

  const handleEditInstitution = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowModal(true);
  };

  const handleRemoveInstitution = async (institution: Institution) => {
    try {
      const response = await axios.delete(`/api/institution/${institution.id}`,{ withCredentials: true });
      if (response.status == 200){
        fetchInstitutions(); 
      }
    } catch (error) {
      console.error("Error deleting institution", error);
    }
  }

  const handleSaveInstitution = async (institution: Institution) => {
    try {
      let response;
      if (institution.id) {
        response = await axios.patch(`/api/institution/${institution.id}`, institution, { withCredentials: true }); 
      } else {
        response = await axios.post("/api/institution/register", institution , { withCredentials: true });
      }
      if (response.status === 200 || response.status === 201) {
        fetchInstitutions(); 
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error saving institution", error);
    }
  };

  return (
    <Container className={`py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <Row className="mb-3">
        <Col>
            <h2 className="text-center">Institution Management</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-2">
          <Button variant="primary" onClick={handleAddInstitution}>
            Add Institution
          </Button>
        </Col>
        <Col className="mb-2">
          <InputGroup >
            <Form.Control
              type="text"
              placeholder="Search institutions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <InstitutionTable
        institutions={institutions}
        filteredInstitutions={filteredInstitutions}
        onEdit={handleEditInstitution}
        onRemove={handleRemoveInstitution}
      />

      {showModal && (
        <InstitutionModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSaveInstitution}
          institution={selectedInstitution}
        />
      )}
    </Container>
  );
};

export default InstitutionManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Manage Institutes - Rakshak",
    },
  };
};