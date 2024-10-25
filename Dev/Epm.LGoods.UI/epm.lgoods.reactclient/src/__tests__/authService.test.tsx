import { authService } from '../services/authService';
import { users } from '../services/dummyData';

describe('authService', () => {
  const validAdminUser = users.find(user => user.role === 'admin');
  const validVendorUser = users.find(user => user.role === 'vendor');
  const invalidUser = { email: 'invalid@example.com', password: 'invalidpassword' };

  beforeEach(() => {
    localStorage.clear();
  });

  test('should login successfully as admin', async () => {
    if (!validAdminUser) {
      throw new Error('No valid admin user found in dummy data');
    }

    const response = await authService.login(validAdminUser.email, validAdminUser.password, false);

    expect(response.success).toBe(true);
    expect(response.role).toBe('admin');
    expect(localStorage.getItem('token')).toBe('dummy-token');
    expect(localStorage.getItem('rememberMe')).toBeNull();
  });

  test('should login successfully as vendor', async () => {
    if (!validVendorUser) {
      throw new Error('No valid vendor user found in dummy data');
    }

    const response = await authService.login(validVendorUser.email, validVendorUser.password, false);

    expect(response.success).toBe(true);
    expect(response.role).toBe('vendor');
    expect(localStorage.getItem('token')).toBe('dummy-token');
    expect(localStorage.getItem('rememberMe')).toBeNull();
  });

  test('should remember email when rememberMe is true', async () => {
    if (!validAdminUser) {
      throw new Error('No valid admin user found in dummy data');
    }

    const response = await authService.login(validAdminUser.email, validAdminUser.password, true);

    expect(response.success).toBe(true);
    expect(response.role).toBe('admin');
    expect(localStorage.getItem('token')).toBe('dummy-token');
    expect(localStorage.getItem('rememberMe')).toBe(validAdminUser.email);
  });

  test('should fail login with incorrect credentials', async () => {
    const response = await authService.login(invalidUser.email, invalidUser.password, false);

    expect(response.success).toBe(false);
    expect(response.role).toBe('vendor');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('rememberMe')).toBeNull();
  });
});
