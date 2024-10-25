import axios from 'axios';

const API_URL = 'http://localhost:5292/api/products/Category';

interface Category {
  categoryName: string;
  description?: string;
  image: File;
}

export const createCategory = async (category: Category): Promise<void> => {
  const formData = new FormData();
  formData.append('categoryName', category.categoryName);
  if (category.description) {
    formData.append('description', category.description);
  }
  formData.append('image', category.image);

  try {
    await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error creating category', error);
    throw error;
  }
};
