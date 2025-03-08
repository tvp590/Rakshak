import React from 'react';
import CustomFormGroup from './customFormGroup';
import { UserFormProps } from '../types';

const UserForm  = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  institutionCode,
  setInstitutionCode,
}: UserFormProps ) => {
  return (
    <>
        <CustomFormGroup
            label="Name"
            type="text"
            value={name}
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            required
        />
        <CustomFormGroup
            label="Email Address"
            type="email"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
        />
        <CustomFormGroup
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
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
        <CustomFormGroup
            label="Institution Code"
            type="text"
            value={institutionCode}
            name="institutionCode"
            onChange={(e) => setInstitutionCode(e.target.value)}
            placeholder="Enter Institution Code"
            required
        />
    </>
  );
};

export default UserForm;
