import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, FormControl, InputGroup, Alert } from "react-bootstrap";
import { useTheme } from "../context/themeContext";
import UserTable from "../components/tables/userTable";
import { Role, User } from "../types";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useUser } from "../context/userContext";
import UserModal from "../components/modals/userModal";

const ManageUsers = () => {
  const { isDarkMode } = useTheme();
  const { user } = useUser();  
  const [users, setUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: Role.User,
    institution_id: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/user/all`, { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      console.log(err)
      setError("Failed to load users.");
    }
  };


  useEffect(() => {
      if (user === null) {
        router.push('/login');
      }
    }, [router, user]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({ name: "", email: "", password: "", role: Role.User, institution_id: 0 });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || Role.User,
      institution_id: user.institution_id || 0,
    });
    setShowModal(true);
  };
  

  const handleRemoveUser = async (userId: number) => {
    try {
      await axios.delete(`/api/user/${userId}`, { withCredentials: true });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.log(err);
      setError("Error deleting user.");
    }
  };

  const handleSaveUser = async () => {
    try {
      if (selectedUser) {
        await axios.patch(`/api/user/${selectedUser.id}`, formData, { withCredentials: true });
      } else {
        await axios.post(`/api/user/register`, formData, { withCredentials: true });
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.log(err);
      setError("Error saving user.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  return (
    <Container className={`py-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-3">
        <Col>
          <h2 className="text-center">Manage Users</h2>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Button variant="primary" onClick={handleAddUser}>Add User</Button>
        </Col>
        <Col md={6}>
          <InputGroup>
            <FormControl type="text" placeholder="Search users..." value={filterText} onChange={handleSearch} />
          </InputGroup>
        </Col>
      </Row>

      <UserTable
        users={users.filter((u) => 
          (u.name && u.name.toLowerCase().includes(filterText.toLowerCase())) || 
          (u.email && u.email.toLowerCase().includes(filterText.toLowerCase()))
        )}
        isDarkMode={isDarkMode}
        onEdit={handleEditUser}
        onRemove={handleRemoveUser}
      />

      {showModal && (
        <UserModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData({
              ...formData,
              [name]: value,
            });
          }}
          formData={formData}
        />
      )}
    </Container>
  );
};

export default ManageUsers;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Manage User - Rakshak",
    },
  };
};