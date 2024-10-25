export interface userRegistration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    mobileNumber: string;
    accountType: string;
    businessName: string;
    city: string;
    state: string;
    ZipCode: string;
}

export interface userLogin {
    email: string,
    password: string,
    role: "admin"| "vendor"
}

export interface LoginResponse {
    success: boolean;
    role: 'vendor' | 'admin';
    token?: string;
  }