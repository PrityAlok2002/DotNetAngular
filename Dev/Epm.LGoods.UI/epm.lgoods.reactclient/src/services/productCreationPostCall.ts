import axios from 'axios';

export const createProduct = async (formData: FormData) => {
  try {
    const response = await axios.post('http://localhost:5292/api/products', formData);
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};