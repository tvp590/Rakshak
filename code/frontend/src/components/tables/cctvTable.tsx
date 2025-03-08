import React from "react";
import { Table, Button } from "react-bootstrap";
import { CCTV, CCTVTableProps } from "../../types";

const CCTVTable = ({
  cctvs,
  searchCCTV,
  onEdit,
  onRemove,
}: CCTVTableProps) => {
    
  const filteredCCTVs = cctvs?.filter(
    (cctv) =>
      cctv.name.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      cctv.location.toLowerCase().includes(searchCCTV.toLowerCase()) ||
      cctv.ip_address.includes(searchCCTV.toLowerCase()) ||
      (cctv.username && cctv.username.toLowerCase().includes(searchCCTV.toLowerCase()))
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
        {filteredCCTVs?.length ? (
          filteredCCTVs.map((cctv : CCTV, index: number) => (
            <tr key={cctv.id}>
              <td>{index + 1}</td>
              <td>{cctv.name}</td>
              <td>{cctv.location}</td>
              <td>{cctv.ip_address}</td>
              <td>{cctv.username}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(cctv)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onRemove(cctv.id)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center">
              No CCTVs found matching your search criteria.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CCTVTable;
