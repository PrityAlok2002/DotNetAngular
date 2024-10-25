import React from 'react';

type SelectFieldProps = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  error?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({ id, name, value, onChange, options, error }) => (
  <div>
    <label htmlFor={id}>{name}</label>
    <select id={id} name={name} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <small className="error">{error}</small>}
  </div>
);

export default SelectField;
