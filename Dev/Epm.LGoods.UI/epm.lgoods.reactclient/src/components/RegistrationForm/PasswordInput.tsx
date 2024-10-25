import React, { ChangeEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface PasswordInputProps {
    id: string;
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, label, name, value, onChange, error, required }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='mb-3 position-relative form-group'>
            <label htmlFor={id} className={`form-label ${required ? 'required-asterisk' : ''}`}>{label}</label>
            <input
                type={showPassword ? "text" : "password"}
                id={id}
                name={name}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={value}
                onChange={onChange}
                required={required}
            />
            {error && <div className="invalid-feedback">{error}</div>}
            <span className="eye-icon" onClick={togglePasswordVisibility} data-testid="toggle-password-visibility">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
        </div>
    );
};

export default PasswordInput;
