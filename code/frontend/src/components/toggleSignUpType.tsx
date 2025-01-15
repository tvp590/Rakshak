import React from 'react';
import { ToggleButtonGroup, ToggleButton, Form } from 'react-bootstrap';
import { useTheme } from '../context/themeContext';

interface ToggleSignUpTypeProps {
  isInstitution: boolean;
  setIsInstitution: (val: boolean) => void;
}

const ToggleSignUpType: React.FC<ToggleSignUpTypeProps> = ({ isInstitution, setIsInstitution }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Form.Group className="mb-4">
      <ToggleButtonGroup
        type="radio"
        name="signUpType"
        value={isInstitution ? 'institution' : 'user'}
        onChange={(val) => setIsInstitution(val === 'institution')}
        className="d-flex justify-content-center w-100 flex-column flex-md-row"
        >
            <ToggleButton
                id="institution"
                value="institution"
                className="w-auto px-4 py-2 text-center mb-2 mb-md-0"
                variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
                Institution Sign Up
            </ToggleButton>
            <ToggleButton
                id="user"
                value="user"
                className="w-auto px-4 py-2 text-center"
                variant={isDarkMode ? 'outline-light' : 'outline-dark'}
                style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
                User Sign Up
            </ToggleButton>
        </ToggleButtonGroup>
    </Form.Group>
  );
};

export default ToggleSignUpType;
