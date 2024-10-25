import React, { ChangeEvent } from 'react';

interface TextInputProps {
    id: string;
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, type, name, value, onChange, error, required }) => (
    <div className='mb-3'>
        <label htmlFor={id} className={`form-label ${required ? 'required-asterisk' : ''}`}>{label}</label>
        <input
            type={type}
            id={id}
            name={name}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            value={value}
            onChange={onChange}
            required={required}
        />
        {error && <div className="invalid-feedback">{error}</div>}
    </div>
);

export default TextInput;
