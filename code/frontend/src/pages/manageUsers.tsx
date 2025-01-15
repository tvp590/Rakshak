import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl, InputGroup } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import UserModal from "../components/modals/userModal";
import UserTable from "../components/tables/userTable";
import { GetStaticProps } from "next";


const ManageUsers = () => {
  const { isDarkMode } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<string>(""); 
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      role: "",
      institution: "" }); 

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = [
        { user_id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", institution: "SomeInstitution1", created_at: "2025-01-01", updated_at: "2025-01-02" },
        { user_id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User", institution: "SomeInstitution2", created_at: "2025-02-01", updated_at: "2025-02-02" },
      ];
      setUsers(fetchedUsers);
    };
    loadUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      role: user.role || "",
      institution: user.institution || "",
    });
    setShowModal(true);
  };

  const handleRemoveUser = (user: any) => {
    setUsers(users.filter((u) => u.user_id !== user.user_id));
  };

  const handleSaveUser = (user: any) => {
    if (user.user_id) {
      // Update user
      setUsers(users.map((u) => (u.user_id === user.user_id ? user : u)));
    } else {
      // Add new user
      setUsers([...users, { ...user, user_id: users.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  
  return (
    <Container className={`py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      <Row className="mb-3">
        <Col>
            <h2 className="text-center">Manage Users</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Button variant="primary" onClick={handleAddUser}>
            Add User
          </Button>
        </Col>
        <Col md={6}>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search by name or email"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      <UserTable
        users={users}
        isDarkMode={isDarkMode}
        filterText={filterText}
        onEdit={handleEditUser}
        onRemove={handleRemoveUser}
      />

      {showModal && (
        <UserModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          handleChange={handleChange}
          formData={formData}
        />
      )}
    </Container>
  );
};

export default ManageUsers;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "Manage Users - Rakshak",
    },
  };
};