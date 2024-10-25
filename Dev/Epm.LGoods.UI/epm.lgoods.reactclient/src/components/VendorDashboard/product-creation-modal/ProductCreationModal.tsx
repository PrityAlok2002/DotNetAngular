import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSquareXmark} from '@fortawesome/free-solid-svg-icons';
import { createProduct } from '../../../services/productCreationPostCall';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./ProductCreationModal.module.css" 

interface ProductCreationModalProps {
  closeModal: () => void;
}
 
const ProductCreationModal: React.FC<ProductCreationModalProps> = ({ closeModal }) => {
  const [productType, setProductType] = useState('');
  const [productName, setProductName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [length, setLength] = useState<number | string>('');
  const [width, setWidth] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
 
  type DecimalFields = 'weight' | 'length' | 'width' | 'height';
 
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
 
    if (!productType) {
      newErrors.productType = 'Product Type is required';
    } else if (typeof productType === 'string' && (productType.length > 50 || /[^a-zA-Z0-9 ]/.test(productType))) {
      newErrors.productType = 'Product Type must be less than 50 characters and contain no special characters';
    }
    
    if (!productName) {
      newErrors.productName = 'Product Name is required';
    } else if (typeof productName === 'string' && (productName.length > 50 || /[^a-zA-Z0-9 ]/.test(productName))) {
      newErrors.productName = 'Product Name must be less than 50 characters and contain no special characters';
    }

    if (!shortDescription) newErrors.shortDescription = 'Short Description is required';

    if (!countryOfOrigin) newErrors.countryOfOrigin = 'Country of Origin is required';
 
    if (stockQuantity !== '' && (isNaN(Number(stockQuantity)) || Number(stockQuantity) <= 0 || stockQuantity.toString().includes('.') || Number(stockQuantity) > 999)) {
      newErrors.stockQuantity = 'Stock Quantity only accepts positive non-decimal values and must be less than 1000';
    }
 
    const decimalFields: Record<DecimalFields, string | number> = { weight, length, width, height };
    (Object.keys(decimalFields) as DecimalFields[]).forEach((field) => {
      const value = decimalFields[field];
      if (value !== '' && (isNaN(Number(value)) || Number(value) <= 0)) {
        newErrors[field] = 'Only accepts positive values';
      }
    });
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
 
    if (!validateFields()) {
      toast.warning('Please fill in all required fields correctly.', { position: 'top-right' });
      return;
    }
 
    const formData = new FormData();
    formData.append('productType', productType);
    formData.append('productName', productName);
    formData.append('shortDescription', shortDescription);
    formData.append('mfgDate', mfgDate);
    formData.append('expiryDate', expiryDate);
    formData.append('countryOfOrigin', countryOfOrigin);
    formData.append('stockQuantity', stockQuantity.toString());
    formData.append('weight', weight.toString());
    formData.append('length', length.toString());
    formData.append('width', width.toString());
    formData.append('height', height.toString());
 
 
    try {
      const response = await createProduct(formData);
 
      if (response.status === 201) {
        toast.success('Product created successfully', { position: 'top-right' });
        setTimeout(() => {
          closeModal();
        }, 3000);
      } else {
        toast.error('Failed to create product', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product', { position: 'top-right' });
    }
  };
 
  const handleFieldChange = (field: string, value: string | number) => {
    switch (field) {
      case 'productType':
        setProductType(value as string);
        break;
      case 'productName':
        setProductName(value as string);
        break;
      case 'shortDescription':
        setShortDescription(value as string);
        break;
      case 'mfgDate':
        setMfgDate(value as string);
        break;
      case 'expiryDate':
        setExpiryDate(value as string);
        break;
      case 'countryOfOrigin':
        setCountryOfOrigin(value as string);
        break;
      case 'stockQuantity':
        setStockQuantity(value);
        break;
      case 'weight':
        setWeight(value);
        break;
      case 'length':
        setLength(value);
        break;
      case 'width':
        setWidth(value);
        break;
      case 'height':
        setHeight(value);
        break;
    }
 
    validateField(field, value);
  };
 
  const validateField = (field: string, value: string | number) => {
    const newErrors = { ...errors };
 
    switch (field) {
      case 'productType':
        if (!value) {
          newErrors.productType = 'Product Type is required';
        } else if (typeof value === 'string' && (value.length > 50 || /[^a-zA-Z0-9 ]/.test(value))) {
          newErrors.productType = 'Product Type must be less than 50 characters and contain no special characters';
        } else {
          delete newErrors.productType;
        }
        break;

      case 'productName':
        if (!value) {
          newErrors.productName = 'Product Name is required';
        } else if (typeof value === 'string' && (value.length > 50 || /[^a-zA-Z0-9 ]/.test(value))) {
          newErrors.productName = 'Product Name must be less than 50 characters and contain no special characters';
        } else {
          delete newErrors.productName;
        }
        break;
      case 'shortDescription':
        if (!value) {
          newErrors.shortDescription = 'Short Description is required';
        } else {
          delete newErrors.shortDescription;
        }
        break;
      case 'countryOfOrigin':
        if (!value) {
          newErrors.countryOfOrigin = 'Country of Origin is required';
        } else {
          delete newErrors.countryOfOrigin;
        }
        break;
      case 'stockQuantity':
        if (value !== '' && (isNaN(Number(value)) || Number(value) <= 0 || value.toString().includes('.') || Number(value) > 999)) {
          newErrors.stockQuantity = 'Stock Quantity only accepts positive non-decimal values and must be less than 1000';
        } else {
          delete newErrors.stockQuantity;
        }
        break;
      case 'weight':
      case 'length':
      case 'width':
      case 'height':
        if (value !== '' && (isNaN(Number(value)) || Number(value) <= 0 || Number(value) > 999)) {
          newErrors[field] = 'Only accepts positive values and must be less than 1000';
        } else {
          delete newErrors[field];
        }
        break;
      case 'expiryDate':
        if (mfgDate && value && new Date(mfgDate) > new Date(value as string)) {
          newErrors.expiryDate = 'Exp Date should be later than mfg Date';
        } else {
          delete newErrors.expiryDate;
        }
        break;
    }
 
    setErrors(newErrors);
  };
 
  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={closeModal}>
        <FontAwesomeIcon className={styles.icon} icon={faSquareXmark} />
        </span>
        <center>
          <h2>Add New Product</h2>
        </center>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="productType">
              Product Type <span className={styles.required}>*</span>
            </label>
            <input
              id="productType"
              className={styles.formInput}
              type="text"
              maxLength={50}
              value={productType}
              onChange={(e) => handleFieldChange('productType', e.target.value)
              }
            />
            {errors.productType && <div className={styles.error}>{errors.productType}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="productName">
              Product Name <span className={styles.required}>*</span>
            </label>
            <input
              id="productName"
              className={styles.formInput}
              type="text"
              maxLength={50}
              value={productName}
              onChange={(e) => handleFieldChange('productName', e.target.value)}
            />
            {errors.productName && <div className={styles.error}>{errors.productName}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="shortDescription">
              Short Description <span className={styles.required}>*</span>
            </label>
            <input
              id="shortDescription"
              className={styles.formInput}
              type="text"
              maxLength={150}
              value={shortDescription}
              onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
            />
            {errors.shortDescription && <div className={styles.error}>{errors.shortDescription}</div>}
          </div>
          <div className={styles.formGroupDate}>
            <div>
              <label className={styles.formLabel} htmlFor="mfgDate">
                Manufacturing Date
              </label>
              <input
                id="mfgDate"
                className={styles.formInput}
                type="date"
                value={mfgDate}
                onChange={(e) => handleFieldChange('mfgDate', e.target.value)}
              />
            </div>
            <div>
              <label className={styles.formLabel} htmlFor="expiryDate">
                Expiry Date
              </label>
              <input
                id="expiryDate"
                className={styles.formInput}
                type="date"
                value={expiryDate}
                onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
              />
            </div>
          </div>
          {errors.expiryDate && <div className={styles.error}>{errors.expiryDate}</div>}
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="countryOfOrigin">
              Country of Origin <span className={styles.required}>*</span>
            </label>
            <select
              id="countryOfOrigin"
              className={styles.formInput}
              value={countryOfOrigin}
              onChange={(e) => handleFieldChange('countryOfOrigin', e.target.value)}
            >
              <option value="">Select a country</option>
              <option value="">Select a country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="China">China</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
            {errors.countryOfOrigin && <div className={styles.error}>{errors.countryOfOrigin}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="stockQuantity">
              Stock Quantity
            </label>
            <input
              id="stockQuantity"
              className={styles.formInput}
              type="number"
              value={stockQuantity}
              maxLength={5}
              onChange={(e) => handleFieldChange('stockQuantity', e.target.value)}
            />
            {errors.stockQuantity && <div className={styles.error}>{errors.stockQuantity}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="weight">
              Weight (kg)
            </label>
            <input
              id="weight"
              className={styles.formInput}
              type="number"
              value={weight}
              onChange={(e) => handleFieldChange('weight', e.target.value)}
            />
            {errors.weight && <div className={styles.error}>{errors.weight}</div>}
          </div>
          <div className={styles.formGroupDimensions}>
            <div>
              <label className={styles.formLabel} htmlFor="length">
                Length (cm)
              </label>
              <input
                id="length"
                className={styles.formInput}
                type="number"
                value={length}
                onChange={(e) => handleFieldChange('length', e.target.value)}
              />
              {errors.length && <div className={styles.error}>{errors.length}</div>}
            </div>
            <div>
              <label className={styles.formLabel} htmlFor="width">
                Width (cm)
              </label>
              <input
                id="width"
                className={styles.formInput}
                type="number"
                value={width}
                onChange={(e) => handleFieldChange('width', e.target.value)}
              />
              {errors.width && <div className={styles.error}>{errors.width}</div>}
            </div>
            <div>
              <label className={styles.formLabel} htmlFor="height">
                Height (cm)
              </label>
              <input
                id="height"
                className={styles.formInput}
                type="number"
                value={height}
                onChange={(e) => handleFieldChange('height', e.target.value)}
              />
              {errors.height && <div className={styles.error}>{errors.height}</div>}
            </div>
          </div>
          <center>
            <button type="submit" className={styles.formButton}>
              Submit
            </button>
          </center>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};
 
export default ProductCreationModal;
