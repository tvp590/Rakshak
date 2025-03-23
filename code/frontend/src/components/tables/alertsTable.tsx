import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import { AlertsTableProps } from "../../types";

const AlertsTable = ({ alerts, onViewAlert, isDarkMode }: AlertsTableProps) => {
  return (
    <Table
      striped
      bordered
      hover
      responsive
      variant={isDarkMode ? "dark" : "light"}
      className="align-middle"
    >
      <thead>
        <tr>
          <th>Weapon Type</th>
          <th>Status</th>
          <th>Time</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {alerts.map((alert) => (
          <tr key={alert.created_at + alert.cctv_id}>
            <td>{alert.weapon_type}</td>
            <td>{alert.status}</td>
            <td style={{ whiteSpace: "nowrap" }}>{alert.created_at}</td>
            <td>
              {alert.image_path ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_URL}${alert.image_path.replace(".", "")}`}
                  alt="Alert Image"
                  thumbnail
                  style={{ width: "120px", height: "auto", objectFit: "cover", borderRadius: "8px" }}
                />
              ) : (
                <span>No image</span>
              )}
            </td>
            <td>
              <Button size="sm" variant="primary" onClick={() => onViewAlert(alert)}>
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
