import React from 'react';
import CustomFormGroup from './customFormGroup';
import { InstitutionFormProps } from '../types';

const InstitutionForm = ({
  institutionName,
  setInstitutionName,
  institutionEmail,
  setInstitutionEmail,
  institutionContact,
  setInstitutionContact,
  institutionAddress,
  setInstitutionAddress,
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
          label="Institution Address"
          type="text"
          value={institutionAddress}
          name="institutionAddress"
          onChange={(e) => setInstitutionAddress(e.target.value)}
          placeholder="Enter Institution's address"
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
