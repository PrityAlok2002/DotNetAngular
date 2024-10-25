import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './CategoryCreationModal.module.css';
import { createCategory } from '../../../services/categoryCreationPostCall';

interface CategoryCreationModalProps {
  closeModal: () => void;
}

const CategoryCreationModal: React.FC<CategoryCreationModalProps> = ({ closeModal }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5292/api/products/Category');
        console.log(response.data.$values);
        
        const categoryNames = response.data.$values.map((category: any) => category.categoryName);
        setExistingCategories(categoryNames);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error fetching categories. Please try again later.';
        toast.error(errorMessage, { position: 'top-right' });
      }
    };

    fetchCategories();
  }, []);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!categoryName.trim()) newErrors.categoryName = 'Category Name is required';
    if (categoryName.trim().length > 50) newErrors.categoryName = 'Category Name cannot exceed 50 characters';
    if (existingCategories.includes(categoryName.trim())) newErrors.categoryName = 'This Category has already existed';

    if (!image) newErrors.image = 'Image is required';
    if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
      newErrors.image = 'Only images are allowed (PNG, JPEG)';
    }
    if (image && image.size > 2 * 1024 * 1024) {
      newErrors.image = 'File size must be less than 2MB';
    }

    if (description.length > 500) newErrors.description = 'Description cannot exceed 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateFields()) {
      toast.warning('Please fill in all required fields correctly.', { position: 'top-right' });
      return;
    }

    try {
      await createCategory({ categoryName: categoryName.trim(), description, image: image as File });

      toast.success('Category created successfully', { position: 'top-right' });
      setCategoryName('');
      setDescription('');
      setImage(null);
      setErrors({});
      setTimeout(() => {
        closeModal();
      }, 4000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error creating category. Please try again later.';
      toast.error(errorMessage, { position: 'top-right' });
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={closeModal}>X</span>
        <center><h2>Create New Category</h2></center>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="categoryName">
              Category Name <span className={styles.required}>*</span>
            </label>
            <input
              id="categoryName"
              className={styles.formInput}
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            {errors.categoryName && <div className={styles.error}>{errors.categoryName}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="description">Description</label>
            <textarea
              id="description"
              className={styles.formInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <div className={styles.error}>{errors.description}</div>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="image">
              Image <span className={styles.required}>*</span>
            </label>
            <input
              id="image"
              className={styles.formInput}
              type="file"
              accept="image/jpeg, image/png"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
            {errors.image && <div className={styles.error}>{errors.image}</div>}
          </div>
          <center>
            <button type="submit" className={styles.formButton}>Create</button>
          </center>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CategoryCreationModal;
