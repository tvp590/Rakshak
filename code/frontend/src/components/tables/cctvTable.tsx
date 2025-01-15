import React from "react";
import { Table, Button } from "react-bootstrap";

interface CCTVTableProps{
    cctvs: any[];
    searchCCTV: string;
    onEdit: (cctv: any) => void;
    onRemove: (id: number) => void;
}

const CCTVTable = ({
  cctvs,
  searchCCTV,
  onEdit,
  onRemove,
}: CCTVTableProps ) => {
    
  const filteredCCTVs = cctvs.filter(
    (cctv) =>
      cctv.name.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      cctv.location.toLowerCase().includes(searchCCTV.toLowerCase())
  );

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Location</th>
          <th>IP Address</th>
          <th>Username</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredCCTVs.map((cctv, index) => (
          <tr key={cctv.id}>
            <td>{index + 1}</td>
            <td>{cctv.name}</td>
            <td>{cctv.location}</td>
            <td>{cctv.ip}</td>
            <td>{cctv.username}</td>
            <td>
              <Button variant="info" size="sm" className="me-2" onClick={() => onEdit(cctv)}>
                Update
              </Button>
              <Button variant="danger" size="sm" onClick={() => onRemove(cctv.id)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
        {filteredCCTVs.length === 0 && (
          <tr>
            <td colSpan={6} className="text-center">
              No CCTVs found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CCTVTable;
