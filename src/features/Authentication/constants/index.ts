import { DistributorRegisterForm } from '../types/auth';

export const signInFormDefaultValues = {
  email: '',
  password: '',
};

export const buyerSignUpFormDefaultValues = {
  email: '',
  firstName: '',
  lastName: '',
  confirmPassword: '',
  password: '',
  homeAddress: '',
  referredByCode: '',
};

export const forgotPasswordDefaultValues = {
  email: '',
};

export const resetPasswordDefaultValues = {
  password: '',
  confirmPassword: '',
};

export const distributorSignUpFormDefaultValues: DistributorRegisterForm = {
  distributorName: '',
  bizProfile: '',
  proofOfAddress: '',
  address: '',
  uen: '',
  username: '',
  password: '',
  confirmPassword: '',
  contactName: '',
  email: '',
  contactNumber: '',
};
