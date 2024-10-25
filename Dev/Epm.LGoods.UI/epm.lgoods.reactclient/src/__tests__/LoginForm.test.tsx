import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { authService } from '../services/authService';
import LoginForm from '../components/LoginForm/LoginForm';


jest.mock('../services/authService');

const mockLogin = authService.login as jest.MockedFunction<typeof authService.login>;

describe('LoginForm', () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockLogin.mockReset();
  });

  test('renders the form with email and password fields', () => {
    setup();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember Me/i)).toBeInTheDocument();
  });

  test('shows validation errors when fields are empty', async () => {
    setup();
    fireEvent.click(screen.getByText(/Login/i));

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  });

  test('shows validation error for invalid email', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  test('shows validation error for short password', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'short' } });
    fireEvent.click(screen.getByText(/Login/i));

    expect(await screen.findByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();
  });

  test('calls authService.login on form submit with correct data', async () => {
    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', false);
    });
  });

  test('handles successful login and navigation', async () => {
    mockLogin.mockResolvedValueOnce({ success: true, role: 'admin' });

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'admin123', false);
    });

 
    await waitFor(() => {
      expect(screen.queryByText(/Email and\/or Password are incorrect/i)).not.toBeInTheDocument();
    });
  });

  test('updates rememberMe state on checkbox change', () => {
    setup();
    const rememberMeCheckbox = screen.getByLabelText(/Remember Me/i);
    expect(rememberMeCheckbox).not.toBeChecked();

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('handles login failure and displays toast message', async () => {
    mockLogin.mockResolvedValueOnce({ success: false, role: 'vendor' });

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', false);
    });

    await waitFor(() => {
      expect(screen.getByText(/Email and\/or Password are incorrect/i)).toBeInTheDocument();
    });
  });

  test('handles login error and displays toast message', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Network error'));

    setup();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', false);
    });

    await waitFor(() => {
      expect(screen.getByText(/An error occurred. Please try again./i)).toBeInTheDocument();
    });
  });

});
