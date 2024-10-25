import React from 'react';

type TextFieldProps = {
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  type?: string;
  maxLength?: number;
};

const TextField: React.FC<TextFieldProps> = ({ id, name, value, onChange, placeholder, error, type = 'text', maxLength }) => (
  <div>
    <label htmlFor={id}>{placeholder}</label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
    />
    {error && <small className="error">{error}</small>}
  </div>
);

export default TextField;
