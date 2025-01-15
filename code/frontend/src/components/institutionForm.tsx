import React from 'react';
import CustomFormGroup from './customFormGroup';

interface InstitutionFormProps {
  institutionName: string;
  setInstitutionName: (value: string) => void;
  institutionEmail: string;
  setInstitutionEmail: (value: string) => void;
  institutionContact: string;
  setInstitutionContact: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
}

const InstitutionForm = ({
  institutionName,
  setInstitutionName,
  institutionEmail,
  setInstitutionEmail,
  institutionContact,
  setInstitutionContact,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
} : InstitutionFormProps) => {
  return (
    <>
        <CustomFormGroup
            label="Institution Name"
            type="text"
            value={institutionName}
            name="institutionName"
            onChange={(e) => setInstitutionName(e.target.value)}
            placeholder="Enter your Institution's Name"
            required
        />
        <CustomFormGroup
            label="Institution Official Email ID (Admin)"
            type="email"
            value={institutionEmail}
            name="institutionEmail"
            onChange={(e) => setInstitutionEmail(e.target.value)}
            placeholder="Enter the Institution's official email ID"
            required
        />
        <CustomFormGroup
            label="Institution Contact Details"
            type="text"
            value={institutionContact}
            name="institutionContact"
            onChange={(e) => setInstitutionContact(e.target.value)}
            placeholder="Enter Institution's contact details"
            required
        />
        <CustomFormGroup
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required 
        />
        <CustomFormGroup
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            name="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
        />
    </>
  );
};

export default InstitutionForm;
