import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useTheme } from '../context/themeContext';
import { GetStaticProps } from 'next';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  const handleNextStep = () => {
    if (step === 1 && !email) {
      setError('Please enter your registered email ID.');
      return;
    }
    if (step === 2 && !otp) {
      setError('Please enter the OTP sent to your email.');
      return;
    }
    if (step === 3 && (newPassword !== confirmNewPassword || !newPassword)) {
      setError('Passwords do not match or are empty.');
      return;
    }
    setError('');
    setStep((prevStep) => prevStep + 1);
  };

  // Simulating sending OTP (replace with actual API call)
  const sendOtp = () => {
    console.log(`OTP sent to ${email}`);
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '85vh' }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className={`shadow-lg rounded p-4 ${isDarkMode ? 'bg-dark text-light' : 'bg-light'}`}>
            <Card.Body>
              <h4 className="text-center mb-4">
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Enter OTP'}
                {step === 3 && 'Reset Password'}
              </h4>

              {error && (
                <div className="alert alert-danger mb-3" role="alert">
                  {error}
                </div>
              )}

              {step === 1 && (
                <Form>
                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label>Registered Email ID</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email ID"
                      required
                      className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-dark"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="button"
                    className="w-100"
                    onClick={() => {
                      handleNextStep();
                      sendOtp();
                    }}
                  >
                    Send OTP
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form>
                  <Form.Group controlId="otp" className="mb-4">
                    <Form.Label>OTP Code</Form.Label>
                    <Form.Control
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter the OTP sent to your email"
                      required
                      className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-dark"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="button"
                    className="w-100"
                    onClick={handleNextStep}
                  >
                    Verify OTP
                  </Button>
                </Form>
              )}

              {step === 3 && (
                <Form>
                  <Form.Group controlId="newPassword" className="mb-4">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-dark"
                    />
                  </Form.Group>

                  <Form.Group controlId="confirmNewPassword" className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className="py-2 px-4 border-2 rounded-2 shadow-sm bg-light text-dark"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="button"
                    className="w-100"
                    onClick={handleNextStep}
                  >
                    Reset Password
                  </Button>
                </Form>
              )}

              {step === 4 && (
                <div className="text-center">
                  <h5 className="text-success mb-4">Password Reset Successfully!</h5>
                  <Button
                    variant="primary"
                    onClick={() => window.location.replace('/login')}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "Forgot Password - Rakshak",
    },
  };
};
