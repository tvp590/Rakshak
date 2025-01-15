import React from "react";
import { Table, Button } from "react-bootstrap";

interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
  institution: string;
  created_at: string;
  updated_at: string;
}

interface UserTableProps {
  users: User[];
  isDarkMode: boolean;
  filterText: string;
  onEdit: (user: User) => void;
  onRemove: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, isDarkMode, filterText, onEdit, onRemove }) => {
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase())
  );

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
        {filteredUsers.map((user) => (
          <tr key={user.user_id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.institution}</td>
            <td>{user.created_at}</td>
            <td>{user.updated_at}</td>
            <td>
              <Button variant="warning" onClick={() => onEdit(user)} className="me-2">
                Edit
              </Button>
              <Button variant="danger" onClick={() => onRemove(user)}>
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
