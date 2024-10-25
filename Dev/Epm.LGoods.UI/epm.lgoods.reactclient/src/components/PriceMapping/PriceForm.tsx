import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PriceFormData } from '../../types/type';
import "../../styles/price-form.css";
import TextField from './TextFields';
import SelectField from './SelectFields';


type PriceFormProps = {
  onSubmit: (data: PriceFormData) => void;
};

const PriceForm: React.FC<PriceFormProps> = ({ onSubmit }) => {
  const [formState, setFormState] = useState<PriceFormData>({
    priceAmount: 0,
    currency: 'INR',
    discountPercentage: 0,
    effectivePrice: 0,
    productId: 0,
    vendorId: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const effectivePrice = formState.priceAmount - (formState.priceAmount * formState.discountPercentage) / 100;
    setFormState((prevState) => ({ ...prevState, effectivePrice }));
  }, [formState.priceAmount, formState.discountPercentage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    let valid = true;
    let errors: { [key: string]: string } = {};

    if (!formState.priceAmount) {
      errors.priceAmount = 'Price is required.';
      valid = false;
    } else if (!/^\d{1,10}$/.test(formState.priceAmount.toString())) {
      errors.priceAmount = 'Invalid price format.';
      valid = false;
    }

    if (!formState.currency) {
      errors.currency = 'Currency is required.';
      valid = false;
    }

    if (!formState.discountPercentage) {
      errors.discountPercentage = 'Discount Percentage is required.';
      valid = false;
    } else if (formState.discountPercentage < 0 || formState.discountPercentage > 100) {
      errors.discountPercentage = 'Discount Percentage must be between 0 and 100.';
      valid = false;
    }

    if (!formState.productId) {
      errors.productId = 'Product ID is required.';
      valid = false;
    } else if (!/^\d{1,10}$/.test(formState.productId.toString())) {
      errors.productId = 'Product ID must be a number up to 10 digits.';
      valid = false;
    }

    if (!formState.vendorId) {
      errors.vendorId = 'Vendor ID is required.';
      valid = false;
    } else if (!/^\d{1,10}$/.test(formState.vendorId.toString())) {
      errors.vendorId = 'Vendor ID must be a number up to 10 digits.';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        console.log('Sending data to backend:', formState);
  
        const response = await axios.post('http://localhost:5292/api/Prices', formState);
        
        if(response.statusText === 'OK') {
          console.log("Success");
          
        };
        onSubmit(response.data);

        setSuccessMessage('Price added successfully.');
        setErrorMessage('');
        setFormState({
          priceAmount: 0,
          currency: 'INR',
          discountPercentage: 0,
          effectivePrice: 0,
          productId: 0,
          vendorId: 0,
        });
      } catch (error) {
        setErrorMessage('Failed to submit the form. Please try again.');
        setSuccessMessage('');
      }
    } else {
      setErrorMessage('All fields are mandatory.');
      setSuccessMessage('');
    }
  };
  
  return (
    
    <div className="price-form-container">
      <h2>Product Price Management</h2>

      <form onSubmit={handleSubmit} className="price-form">
        <TextField
          id="priceAmount"
          name="priceAmount"
          value={formState.priceAmount}
          onChange={handleChange}
          placeholder="Enter price"
          error={errors.priceAmount}
          maxLength={10}
        />

        <SelectField
          id="currency"
          name="currency"
          value={formState.currency}
          onChange={handleChange}
          options={[
            { value: 'INR', label: 'INR' },
            { value: 'USD', label: 'USD' },
          ]}
          error={errors.currency}
        />

       <TextField
          id="discountPercentage"
          name="discountPercentage"
          value={formState.discountPercentage}
          onChange={handleChange}
          placeholder="Enter discount percentage"
          error={errors.discountPercentage}
          maxLength={3}
        />

        <TextField
          id="effectivePrice"
          name="effectivePrice"
          value={formState.effectivePrice}
          onChange={handleChange}
          placeholder="Effective Price"
          type="number"
          error=""
          maxLength={3}
        />

        <TextField
          id="productId"
          name="productId"
          value={formState.productId}
          onChange={handleChange}
          placeholder="Enter product ID"
          error={errors.productId}
          maxLength={10}
        />

        <TextField
          id="vendorId"
          name="vendorId"
          value={formState.vendorId}
          onChange={handleChange}
          placeholder="Enter vendor ID"
          error={errors.vendorId}
          maxLength={10}
        />


        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="submit-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default PriceForm;





