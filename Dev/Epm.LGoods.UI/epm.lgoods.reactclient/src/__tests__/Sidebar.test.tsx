import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../components/VendorDashboard/manage-product/Sidebar';


describe('Sidebar Component', () => {
    const mockOnApplyFilters = jest.fn();
    const mockCloseSidebar = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders Sidebar component', () => {
        render(<Sidebar onApplyFilters={mockOnApplyFilters} closeSidebar={mockCloseSidebar} />);

        expect(screen.getByText('Apply Filters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Product Type')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Categories')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Manufacturer')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    });

    test('handles input changes', () => {
        render(<Sidebar onApplyFilters={mockOnApplyFilters} closeSidebar={mockCloseSidebar} />);

        const productTypeInput = screen.getByPlaceholderText('Product Type') as HTMLInputElement;
        fireEvent.change(productTypeInput, { target: { value: 'Electronics' } });
        expect(productTypeInput.value).toBe('Electronics');

        const categoriesInput = screen.getByPlaceholderText('Categories') as HTMLInputElement;
        fireEvent.change(categoriesInput, { target: { value: 'Laptops' } });
        expect(categoriesInput.value).toBe('Laptops');

        const manufacturerInput = screen.getByPlaceholderText('Manufacturer') as HTMLInputElement;
        fireEvent.change(manufacturerInput, { target: { value: 'Apple' } });
        expect(manufacturerInput.value).toBe('Apple');

        const countrySelect = screen.getByRole('combobox') as HTMLSelectElement;
        fireEvent.change(countrySelect, { target: { value: 'USA' } });
        expect(countrySelect.value).toBe('USA');

        const priceInput = screen.getByPlaceholderText('Price') as HTMLInputElement;
        fireEvent.change(priceInput, { target: { value: '1000' } });
        expect(priceInput.value).toBe('1000');
    });

    test('submits the form and applies filters', () => {
        render(<Sidebar onApplyFilters={mockOnApplyFilters} closeSidebar={mockCloseSidebar} />);

        const applyButton = screen.getByRole('button', { name: 'Apply' });
        fireEvent.click(applyButton);

        expect(mockOnApplyFilters).toHaveBeenCalledWith({
            productType: '',
            categories: '',
            manufacturer: '',
            countryOfOrigin: '',
            price: ''
        });
    });

    test('closes the sidebar', () => {
        render(<Sidebar onApplyFilters={mockOnApplyFilters} closeSidebar={mockCloseSidebar} />);

        const closeButton = screen.getByRole('button', { name: '×' });
        fireEvent.click(closeButton);

        expect(mockCloseSidebar).toHaveBeenCalled();
    });
});
