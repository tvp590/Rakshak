import React from "react";
import { Table, Button } from "react-bootstrap";
import { User, UserTableProps } from "../../types";

const UserTable= ({ users, isDarkMode, onEdit, onRemove }: UserTableProps) => {

  return (
    <Table striped bordered hover responsive className={`${isDarkMode ? "table-dark" : "table-light"}`}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Institution</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user : User) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.institution_id}</td>
            <td>{user.created_at}</td>
            <td>{user.updated_at}</td>
            <td>
              <Button variant="warning" onClick={() => onEdit(user)} className="me-2">
                Edit
              </Button>
              <Button variant="danger" onClick={() => user.id !== null && onRemove(user.id)}>
                Remove
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
