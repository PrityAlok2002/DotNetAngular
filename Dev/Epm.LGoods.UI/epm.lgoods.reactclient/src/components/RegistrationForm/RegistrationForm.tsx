import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "../../styles/RegistrationForm.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import TextInput from './TextInputs';
import RadioInput from './RadioInput';
import { userRegistration } from '../../types/userType';


const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<userRegistration>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobileNumber: '',
        accountType: '',
        businessName: '',
        city: '',
        state: '',
        ZipCode: '',
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let updatedValue = value;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: updatedValue,
        }));
    };

    const validateForm = () => {
        const { firstName, lastName, email, mobileNumber, password, accountType, businessName, city, state, ZipCode } = formData;
        const newErrors: { [key: string]: string } = {};

    
        if (!firstName.trim()) {
            newErrors.firstName = "First Name is required";
        } 
        if (!lastName.trim()) {
            newErrors.lastName = "Last Name is required";
        } 

     
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(email)) {
            newErrors.email = "Invalid email format.";
        }

     
        const mobileNumberPattern = /^\d{10}$/;
        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile Number is required";
        } else if (!mobileNumberPattern.test(mobileNumber)) {
            newErrors.mobileNumber = "Mobile Number should be exactly 10 digits.";
        }

       
        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 6) {
            newErrors.password = "Password should be at least 6 characters long.";
        } 

        
        if (!accountType) {
            newErrors.accountType = "Role is required";
        }

      
        if (accountType === 'Vendor') {
            if (!businessName.trim()) {
                newErrors.businessName = "Business Name is required for vendors.";
            } else if (businessName.length > 20) {
                newErrors.businessName = "Business Name should not exceed 20 characters.";
            }
            if (!city.trim()) {
                newErrors.city = "City is required for vendors.";
            } else if (city.length > 10) {
                newErrors.city = "City should not exceed 10 characters.";
            }
            if (!state.trim()) {
                newErrors.state = "State is required for vendors.";
            } else if (state.length > 10) {
                newErrors.state = "State should not exceed 20 characters.";
            }
            if (!ZipCode.trim() || !/^\d{6}$/.test(ZipCode)) {
                newErrors.ZipCode = "Pin Code is required for vendors and should be exactly 6 digits.";
            } else if (ZipCode.length > 6) {
                newErrors.ZipCode = "Pin Code should not exceed 6 digits.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                console.log("Form Data:", formData);
                const response = await axios.post('http://localhost:5298/api/Registration', formData);

                console.log(response.status === 200);
                
                
                if(response.status === 200) {
                setMessage('Registration Successful!');
                }
            } catch (error) {
                setMessage('Registration failed. Please try again.');
               
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='container-fluid vh-100 d-flex align-items-center bg-image bg-yellowish'>
            <div className='col-md-12 offset-md-6 col-lg-5 offset-lg-4 bg-custom p-4 rounded shadow'>
                <form onSubmit={handleSubmit} className="registration-form">
                    
                    <TextInput
                        id="firstName"
                        label="First Name"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        required
                    />
                    
                    <TextInput
                        id="lastName"
                        label="Last Name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        required
                    />
                    <TextInput
                        id="email"
                        label="Email ID"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        required
                    />

                    <div className='mb-3 positive-relative form-group'>
                        <label htmlFor="password" className='form-label required-asterisk'>Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        <span className="eye-icon" onClick={togglePasswordVisibility}  data-testid="toggle-password-visibility">
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                    
                    <TextInput
                        id="mobileNumber"
                        label="Mobile Number"
                        type="tel"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        error={errors.mobileNumber}
                        required
                    />


                    <div className="mb-3">
                        <label htmlFor="Admin" className="form-label required-asterisk">Account Type:</label>
                        <div>
                            
                            <RadioInput
                                id="Admin"
                                label="Admin"
                                name="accountType"
                                value="Admin"
                                checked={formData.accountType === 'Admin'}
                                onChange={handleChange}
                            />
                            <RadioInput
                                id="Vendor"
                                label="Vendor"
                                name="accountType"
                                value="Vendor"
                                checked={formData.accountType === 'Vendor'}
                                onChange={handleChange}
                            />


                        </div>
                        
                    </div>
                    {errors.accountType && <div className="invalid-feedback d-block">{errors.accountType}</div>}
                    {formData.accountType === 'Vendor' && (
                        <div className="additional-fields">
                            
                            <TextInput
                                id="businessName"
                                label="Business Name"
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleChange}
                                error={errors.businessName}
                                required
                            />
                            <TextInput
                                id="city"
                                label="City"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                required
                            />
                            <TextInput
                                id="state"
                                label="State"
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={errors.state}
                                required
                            />
                            <TextInput
                                id="ZipCode"
                                label="Zip Code"
                                type="text"
                                name="ZipCode"
                                value={formData.ZipCode}
                                onChange={handleChange}
                                error={errors.ZipCode}
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary mb-5 w-100">register</button>
                </form>
                {message && <div className="alert alert-info mt-3">{message}</div>}

                <div className="text-center mt-3">
                <span>Already have an account?</span>
                <Link  to={"/"}  className="text-center mt-3"> Log in </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
