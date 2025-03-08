import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import { AlertsTableProps } from "../../types";


const AlertsTable = ({ alerts, onViewAlert, isDarkMode } : AlertsTableProps) => {
  return (
    <Table striped bordered hover responsive variant={isDarkMode ? "dark" : "light"}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Weapon Type</th>
          <th>Status</th>
          <th>Time</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((alert) => (
          <tr key={alert.id}>
            <td>{alert.id}</td>
            <td>{alert.weapon_type}</td>
            <td>{alert.status}</td>
            <td>{alert.created_at}</td>
            <td>
              {alert.image_path ? (
                <Image
                  src={alert.image_path}
                  alt="Alert Image"
                  thumbnail
                  width={100}
                  height={100}
                />
              ) : (
                <p>No image available</p>
              )}
            </td>
            <td>
              <Button variant="primary" onClick={() => onViewAlert(alert)}>
                View Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AlertsTable;
