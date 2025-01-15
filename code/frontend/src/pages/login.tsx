import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import CustomFormGroup from '../components/customFormGroup';
import Link from 'next/link';
import { GetStaticProps } from 'next';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Todo : Perform login logic here
    console.log('Email:', email);
    console.log('Password:', password);
    setError('Invalid email or password')
    router.push('/dashboard');
    // e.preventDefault();
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '85vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-lg rounded p-4">
            <Card.Body>
            <h4 
                className="text-center mb-4" 
                style={{ fontSize: '2rem', fontWeight: '600', letterSpacing: '1px', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#007bff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
                Login
            </h4>
            {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}
              <Form onSubmit={handleSubmit}>
                <CustomFormGroup
                  label="Email Address"
                  type="email"
                  name = "email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
                
                <CustomFormGroup
                  label="Password"
                  type="password"
                  name = "password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />

                <Button variant="primary" type="submit" className="w-100 mt-2 mb-3">
                  Log In
                </Button>
              </Form>

              <Row>
                <Col className="text-center">
                <Link href="/forgot-password" className="text-decoration-none text-primary hover-underline">
                    Forgot Password?
                </Link>
                </Col>
              </Row>
              <Row>
                <Col className="text-center">
                    Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-decoration-none text-primary hover-underline">
                     Sign Up
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

export default LoginPage;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "Login - Rakshak",
    },
  };
};
