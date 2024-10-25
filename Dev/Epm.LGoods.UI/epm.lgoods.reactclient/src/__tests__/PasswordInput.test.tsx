import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordInput from '../components/RegistrationForm/PasswordInput';


describe('PasswordInput Component', () => {
    const setup = (props = {}) => {
        const initialProps = {
            id: 'password',
            label: 'Password',
            name: 'password',
            value: '',
            onChange: jest.fn(),
            error: '',
            required: true,
            ...props,
        };
        return render(<PasswordInput {...initialProps} />);
    };

    test('renders the component with required props', () => {
        setup();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    test('toggles password visibility', () => {
        setup();
        const toggleButton = screen.getByTestId('toggle-password-visibility');
        const input = screen.getByLabelText('Password');

        // Initially the password should be hidden
        expect(input).toHaveAttribute('type', 'password');

        // Click to show the password
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'text');

        // Click again to hide the password
        fireEvent.click(toggleButton);
        expect(input).toHaveAttribute('type', 'password');
    });

    test('calls onChange handler when input value changes', () => {
        const handleChange = jest.fn();
        setup({ onChange: handleChange });

        const input = screen.getByLabelText('Password');
        fireEvent.change(input, { target: { value: 'newpassword' } });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
    });

    test('displays an error message when error prop is passed', () => {
        const errorMessage = 'Password is required';
        setup({ error: errorMessage });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toHaveClass('is-invalid');
    });

    test('adds required asterisk to label when required prop is true', () => {
        setup();
        const label = screen.getByText('Password');
        expect(label).toHaveClass('required-asterisk');
    });

    test('does not add required asterisk to label when required prop is false', () => {
        setup({ required: false });
        const label = screen.getByText('Password');
        expect(label).not.toHaveClass('required-asterisk');
    });
});
