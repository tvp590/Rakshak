import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useTheme } from '../context/themeContext';
import Link from 'next/link';
import ToggleSignUpType from '../components/toggleSignUpType';
import InstitutionForm from '../components/institutionForm';
import UserForm from '../components/userForm';
import { GetStaticProps } from 'next';

const SignUpPage = () => {
  const [isInstitution, setIsInstitution] = useState<boolean>(false);
  const [institutionName, setInstitutionName] = useState<string>('');
  const [institutionEmail, setInstitutionEmail] = useState<string>('');
  const [institutionContact, setInstitutionContact] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [institutionCode,setInstitutionCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isInstitution) {
      if (!institutionName || !institutionEmail || !institutionContact || !password || !confirmPassword) {
        setError('Please fill in all fields for institution sign-up.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      console.log('Institution Name:', institutionName);
      console.log('Institution Email:', institutionEmail);
      console.log('Institution Contact:', institutionContact);
      setError('');
      router.push('/dashboard');
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields for user sign-up.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      console.log('User Name:', name);
      console.log('Email:', email);
      setError('');
      router.push('/dashboard');
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "sign Up - Rakshak",
    },
  };
};