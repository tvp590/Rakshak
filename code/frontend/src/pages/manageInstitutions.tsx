// InstitutionManagement.tsx
import React, { useState } from "react";
import { Button, InputGroup, Form, Container, Row, Col } from "react-bootstrap";
import InstitutionTable from "../components/tables/institutionTable";
import InstitutionModal from "../components/modals/institutionModal";
import { useTheme } from "../context/themeContext";
import { GetStaticProps } from "next";

export interface Institution {
  id: number;
  name: string;
  address: string;
  email:string;
  contact: string;
}

const InstitutionManagement = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([
    { id: 1, name: "Institution A", address: "123 Street",email:"AAA@bbb.ccc", contact: "123-456-7890" },
    { id: 2, name: "Institution B", address: "456 Avenue",email:"DDD@eee.fff", contact: "234-567-8901" },
  ]);

  const [search, setSearch] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const { isDarkMode } = useTheme(); 

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(search.toLowerCase()) ||
      institution.address.toLowerCase().includes(search.toLowerCase()) ||
      institution.email.toLowerCase().includes(search.toLowerCase()) ||
      institution.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddInstitution = () => {
    setShowModal(true);
    setSelectedInstitution(null);
  };

  const handleEditInstitution = (institution: Institution) => {
    setSelectedInstitution(institution);
    setShowModal(true);
  };

  const handleRemoveInstitution = (institution: Institution) => {
    setInstitutions(institutions.filter((i) => i.id !== institution.id));
  };

  const handleSaveInstitution = (institution: Institution) => {
    if (institution.id) {
      // Update existing institution
      setInstitutions(
        institutions.map((i) => (i.id === institution.id ? institution : i))
      );
    } else {
      // Add new institution
      setInstitutions([
        ...institutions,
        { ...institution, id: institutions.length + 1 },
      ]);
    }
    setShowModal(false);
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "Manage Institutes - Rakshak",
    },
  };
};