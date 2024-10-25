import React, { ChangeEvent } from 'react';

interface RadioInputProps {
    id: string;
    label: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

const RadioInput: React.FC<RadioInputProps> = ({ id, label, name, value, checked, onChange, required }) => (
    <div className="form-check form-check-inline">
        <input
            type="radio"
            id={id}
            name={name}
            value={value}
            className="form-check-input"
            checked={checked}
            onChange={onChange}
            required={required}
        />
        <label htmlFor={id} className="form-check-label">{label}</label>
    </div>
);

export default RadioInput;
