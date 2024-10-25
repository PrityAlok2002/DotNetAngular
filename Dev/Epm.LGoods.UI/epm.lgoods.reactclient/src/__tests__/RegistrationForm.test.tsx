import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationForm from '../components/RegistrationForm/RegistrationForm';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';

describe('RegistrationForm', () => {
  let mock: MockAdapter;
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });
  afterAll(() => {
    mock.restore();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };


  test('renders the registration form with all fields', () => {
    renderWithRouter(<RegistrationForm />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account type/i)).toBeInTheDocument();
  });

  test('updates input values on change', () => {
    renderWithRouter(<RegistrationForm />);

    const firstNameInput = screen.getByLabelText(/first name/i) as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');
  });


  test('shows validation errors for invalid data', async () => {
    renderWithRouter(<RegistrationForm />);

    fireEvent.click(screen.getByText(/register/i));

    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/mobile number is required/i)).toBeInTheDocument();
  });

  test('validates email format', async () => {
    renderWithRouter(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/email id/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText(/register/i));

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  test('validates mobile number format', async () => {
    renderWithRouter(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '123' } });
    fireEvent.click(screen.getByText(/register/i));

    expect(await screen.findByText(/mobile number should be exactly 10 digits/i)).toBeInTheDocument();
  });

  test('shows additional fields for Vendor account type', () => {
    renderWithRouter(<RegistrationForm />);

    fireEvent.click(screen.getByLabelText(/Vendor/i));

    expect(screen.getByLabelText(/business name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
  });


  test('submits form and shows success message', async() => {
    const mock = new MockAdapter(axios);
    mock.onPost('http://localhost:5298/api/Registration').reply(200, { success: true });

    renderWithRouter(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email id/i), { target: { value:'john@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Joh00nny@123' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '8909104119' } });
    fireEvent.change(screen.getByLabelText(/Admin/i), { target: { value: 'Admin' } });

    fireEvent.click(screen.getByText(/register/i));

  });

  test('toggles password visibility', () => {
    renderWithRouter(<RegistrationForm />);

    const passwordInput = screen.getByLabelText(/password/i);
    const eyeIcon = screen.getByTestId('toggle-password-visibility'); // Use test id here


    expect(passwordInput).toHaveAttribute('type', 'password');


    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('validates vendor-specific fields', async() => {
    renderWithRouter(<RegistrationForm />);

    fireEvent.click(screen.getByLabelText(/Vendor/i));

    fireEvent.change(screen.getByLabelText(/business name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/zip code/i), { target: { value: '' } });

    fireEvent.click(screen.getByText(/register/i));

    expect(await screen.findByText(/business name is required for vendors/i)).toBeInTheDocument();
    expect(await screen.findByText(/city is required for vendors/i)).toBeInTheDocument();
    expect(await screen.findByText(/state is required for vendors/i)).toBeInTheDocument();
    expect(await screen.findByText(/pin code is required for vendors and should be exactly 6 digits/i)).toBeInTheDocument();
  });

  test('shows error message on form submission failure', async () => {
    const mock = new MockAdapter(axios);
    mock.onPost('http://localhost:5298/api/Registration').reply(400, {
        message: 'Registration failed. Please try again.',
    });

    renderWithRouter(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email id/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Admin/i), { target: { value: 'Admin' } });

    fireEvent.click(screen.getByText(/register/i));
  });

  
  test('validates the form correctly', async () => {
    renderWithRouter(<RegistrationForm />);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/email id/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/mobile number/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByLabelText(/Admin/i), { target: { value: 'Admin' } });

    fireEvent.click(screen.getByText(/register/i));

    await waitFor(() => expect(screen.queryByText(/first name is required/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/last name is required/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/mobile number is required/i)).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText(/Role is required/i)).not.toBeInTheDocument());
});
});


