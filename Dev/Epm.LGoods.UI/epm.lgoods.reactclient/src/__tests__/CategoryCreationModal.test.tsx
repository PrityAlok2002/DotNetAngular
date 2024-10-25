import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import CategoryCreationModal from '../components/VendorDashboard/Categories/CategoryCreationModal';
import { createCategory } from '../services/categoryCreationPostCall';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

jest.mock('axios');
jest.mock('../services/categoryCreationPostCall');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCreateCategory = createCategory as jest.MockedFunction<typeof createCategory>;

describe('CategoryCreationModal', () => {
  const closeModal = jest.fn();

  test('renders CategoryCreationModal component', () => {
    render(
      <>
        <CategoryCreationModal closeModal={closeModal} />
        <ToastContainer />
      </>
    );

    expect(screen.getByText('Create New Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Category Name *')).toBeInTheDocument();
  });

  test('fetches existing categories on mount', async () => {
    mockedAxios.get.mockResolvedValue({ data: [{ name: 'Existing Category' }] });

    render(
      <>
        <CategoryCreationModal closeModal={closeModal} />
        <ToastContainer />
      </>
    );

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5292/api/products/Category');
    });
  });

  test('validates fields and displays errors', async () => {
    render(
      <>
        <CategoryCreationModal closeModal={closeModal} />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByLabelText('Category Name *'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Image *'), { target: { files: [] } });

    fireEvent.click(screen.getByText('Create'));

    expect(await screen.findByText('Category Name is required')).toBeInTheDocument();
    expect(screen.getByText('Image is required')).toBeInTheDocument();
  });

  // test('displays error for existing category name', async () => {
  //   mockedAxios.get.mockResolvedValue({ data: [{ name: 'Existing Category' }] });

  //   render(
  //     <>
  //       <CategoryCreationModal closeModal={closeModal} />
  //       <ToastContainer />
  //     </>
  //   );

  //   fireEvent.change(screen.getByLabelText('Category Name *'), { target: { value: 'Existing Category' } });
  //   fireEvent.change(screen.getByLabelText('Image *'), {
  //     target: { files: [new File([''], 'image.png', { type: 'image/png' })] },
  //   });

  //   fireEvent.click(screen.getByText('Create'));

  //   expect(await screen.findByText('This Category has already existed')).toBeInTheDocument();
  // });

  // test('displays error for invalid image type and size', async () => {
  //   render(
  //     <>
  //       <CategoryCreationModal closeModal={closeModal} />
  //       <ToastContainer />
  //     </>
  //   );

  //   fireEvent.change(screen.getByLabelText('Category Name *'), { target: { value: 'New Category' } });
  //   fireEvent.change(screen.getByLabelText('Image *'), {
  //     target: { files: [new File([''], 'image.bmp', { type: 'image/bmp' })] },
  //   });

  //   fireEvent.click(screen.getByText('Create'));

  //   expect(await screen.findByText('Only images are allowed (PNG, JPEG)')).toBeInTheDocument();

  //   fireEvent.change(screen.getByLabelText('Image *'), {
  //     target: { files: [new File(new Array(2 * 1024 * 1024 + 1).fill('a'), 'image.png', { type: 'image/png' })] },
  //   });

  //   fireEvent.click(screen.getByText('Create'));

  //   expect(await screen.findByText('File size must be less than 2MB')).toBeInTheDocument();
  // });

  test('displays error for description length', async () => {
    render(
      <>
        <CategoryCreationModal closeModal={closeModal} />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByLabelText('Category Name *'), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByLabelText('Image *'), {
      target: { files: [new File([''], 'image.png', { type: 'image/png' })] },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'a'.repeat(501) },
    });

    fireEvent.click(screen.getByText('Create'));

    expect(await screen.findByText('Description cannot exceed 500 characters')).toBeInTheDocument();
  });

  test('handles create category error', async () => {
    render(
      <>
        <CategoryCreationModal closeModal={closeModal} />
        <ToastContainer />
      </>
    );

    fireEvent.change(screen.getByLabelText('Category Name *'), { target: { value: 'New Category' } });
    fireEvent.change(screen.getByLabelText('Image *'), {
      target: { files: [new File([''], 'image.png', { type: 'image/png' })] },
    });

    mockedCreateCategory.mockRejectedValueOnce(new Error('Error creating category'));

    fireEvent.click(screen.getByText('Create'));

    await waitFor(() => expect(mockedCreateCategory).toHaveBeenCalled());

    expect(screen.getByText('Error creating category')).toBeInTheDocument();
  });
});
