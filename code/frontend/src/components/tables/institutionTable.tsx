import React from "react";
import { Table, Button } from "react-bootstrap";
import { Institution } from "../../pages/manageInstitutions";

interface InstitutionTableProps {
  institutions: Institution[];
  filteredInstitutions: Institution[];
  onEdit: (institution: Institution) => void;
  onRemove: (institution: Institution) => void;
}

const InstitutionTable  = ({
  institutions,
  filteredInstitutions,
  onEdit,
  onRemove,
} : InstitutionTableProps) => {
  return (
    <Table striped bordered hover responsive className="shadow-sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Email</th>
          <th>Contact</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredInstitutions.map((institution) => (
          <tr key={institution.id}>
            <td>{institution.name}</td>
            <td>{institution.address}</td>
            <td>{institution.email}</td>
            <td>{institution.contact}</td>
            <td>
              <Button
                variant="warning"
                onClick={() => onEdit(institution)}
                className="mx-1 mb-1"
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => onRemove(institution)}
                className="mx-1 mb-1"
              >
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InstitutionTable;
