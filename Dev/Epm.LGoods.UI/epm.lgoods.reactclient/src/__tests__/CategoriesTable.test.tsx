import { render, screen } from '@testing-library/react';
import CategoriesTable from '../components/VendorDashboard/Categories/CategoriesTable';
import { Categories } from '../types/type';

const mockCategories: Categories[] = [
  { categoryId: '1', categoryName: 'Category 1', description: 'Description 1', image: 'image1.png', isActive: true },
  { categoryId: '2', categoryName: 'Category 2', description: 'Description 2', image: 'image2.png', isActive: false },
];

describe('CategoriesTable', () => {
  test('renders table headers correctly', () => {
    render(<CategoriesTable categories={mockCategories} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Category Name')).toBeInTheDocument();
    expect(screen.getByText('Descritpion')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('IsActive')).toBeInTheDocument();
  });

  test('renders category data correctly', () => {
    render(<CategoriesTable categories={mockCategories} />);

    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    const activeElements = screen.getAllByText('Active');
    expect(activeElements.length).toBe(1);

    const inactiveElements = screen.getAllByText('Inactive');
    expect(inactiveElements.length).toBe(1);
  });
});
