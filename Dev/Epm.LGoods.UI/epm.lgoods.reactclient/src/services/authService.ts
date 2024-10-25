import { users } from './dummyData';
import { userLogin, LoginResponse } from '../types/userType';

const login = async (email: string, password: string, rememberMe: boolean): Promise<LoginResponse> => {
  const user = users.find((user: userLogin) => user.email === email && user.password === password);

  if (user) {
    const token = 'dummy-token';
    localStorage.setItem('token', token);
    if (rememberMe) {
      localStorage.setItem('rememberMe', email);
    }
    return { success: true, role: user.role, token };
  } else {
    return { success: false, role: 'vendor' };  // Default role
  }
};

export const authService = {
  login,
};