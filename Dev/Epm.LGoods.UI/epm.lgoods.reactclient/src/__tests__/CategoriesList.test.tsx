import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CategoriesList from '../components/VendorDashboard/Categories/CategoriesList';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const mockCategories = {
  $values: [
    { categoryId: '1', categoryName: 'Category 1', description: 'Description 1', image: 'image1.png', isActive: true },
    { categoryId: '2', categoryName: 'Category 2', description: 'Description 2', image: 'image2.png', isActive: false },
  ]
};

describe('CategoriesList', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders the CategoriesList component and loads categories', async () => {
    mock.onGet('http://localhost:5292/api/products/Category').reply(200, mockCategories);

    render(<CategoriesList />);

    await waitFor(() => {
      expect(screen.getByText('categories')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Category 2')).toBeInTheDocument();
    });
  });

  // test('opens and closes the category creation modal', async () => {
  //   render(<CategoriesList />);

  //   fireEvent.click(screen.getByText('Add Category'));

  //   await waitFor(() => {
  //     expect(screen.getByText('Create New Category')).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText('X'));

  //   await waitFor(() => {
  //     expect(screen.queryByText('Create New Category')).not.toBeInTheDocument();
  //   });
  // });

  test('displays no categories found when there are no categories', async () => {
    mock.onGet('http://localhost:5292/api/products/Category').reply(200, { $values: [] });

    render(<CategoriesList />);

    await waitFor(() => {
      expect(screen.getByText('No Categories found')).toBeInTheDocument();
    });
  });
});
