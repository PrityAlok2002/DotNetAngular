import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';

describe('AppRoutes', () => {
  const renderWithRouter = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    );
  };

  test('renders LoginPage for "/" route', () => {
    renderWithRouter(['/']);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders AdminDashboard for "/admin-dashboard" route', () => {
    renderWithRouter(['/admin-dashboard']);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  test('renders VendorDashboard for "/vendor-dashboard" route', () => {
    renderWithRouter(['/vendor-dashboard']);
    expect(screen.getByText(/Vendor Dashboard/i)).toBeInTheDocument();
  });

  test('renders ForgotPassword for "/forgot-password" route', () => {
    renderWithRouter(['/forgot-password']);
    expect(screen.getByText(/Forgot Password/i)).toBeInTheDocument();
  });
});