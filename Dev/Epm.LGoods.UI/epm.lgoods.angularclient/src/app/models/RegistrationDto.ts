export interface RegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  mobileNumber: string;
  accountType: string; // Admin or Vendor
  businessName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
