import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useTheme } from '../context/themeContext';
import Link from 'next/link';
import ToggleSignUpType from '../components/toggleSignUpType';
import InstitutionForm from '../components/institutionForm';
import UserForm from '../components/userForm';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { useUser } from '../context/userContext';

const SignUpPage = () => {
  const [isInstitution, setIsInstitution] = useState<boolean>(false);
  const [institutionName, setInstitutionName] = useState<string>('');
  const [institutionEmail, setInstitutionEmail] = useState<string>('');
  const [institutionContact, setInstitutionContact] = useState<string>('');
  const [institutionAddress, setInstitutionAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [institutionCode,setInstitutionCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { setUser } = useUser();
  const { isDarkMode } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isInstitution) {
        if (!institutionName || !institutionEmail || !institutionContact || !password || !confirmPassword) {
          setError("Please fill in all fields for institution sign-up.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const response = await axios.post("/api/institution/register", {
          name: institutionName,
          email: institutionEmail,
          phone: institutionContact,
          password: password,
          address: institutionAddress,
        });

        if (response.status === 201) {
          setUser(response.data.user);
          router.push("/cctvFeeds");
        } else {
          setError("An error occurred during registration.");
        }
      }
      else{
        if (!name || !email || !password || !confirmPassword || !institutionCode) {
          setError("Please fill in all fields for user sign-up.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        const response = await axios.post("/api/user/register", {
          name: name,
          email: email,
          password: password,
          institution_id: institutionCode,
        });
        
        if (response.status === 201) {
          setUser(response.data.user);
          router.push("/cctvFeeds");
        } else {
          setError("An error occurred during registration.");
        }
      }
    } 
    catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className={`shadow-lg rounded p-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
            <Card.Body>
              <h4 className="text-center mb-4">Sign Up</h4>
              
              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}

              <ToggleSignUpType isInstitution={isInstitution} setIsInstitution={setIsInstitution} />

              {isInstitution ? (
                <InstitutionForm
                  institutionName={institutionName}
                  setInstitutionName={setInstitutionName}
                  institutionEmail={institutionEmail}
                  setInstitutionEmail={setInstitutionEmail}
                  institutionContact={institutionContact}
                  setInstitutionContact={setInstitutionContact}
                  institutionAddress={institutionAddress}
                  setInstitutionAddress={setInstitutionAddress}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                />
              ) : (
                <UserForm
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  institutionCode={institutionCode}
                  setInstitutionCode={setInstitutionCode}
                />
              )}

              <Button variant="primary" type="submit" className="w-100 mb-1 mt-1" onClick={handleSubmit}>
                Sign Up
              </Button>

              <Row>
                <Col className="text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="text-decoration-none text-primary hover-underline">
                    Login
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      pageTitle: "Sign Up - Rakshak",
    },
  };
};