import React from 'react';
import { render, screen} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductList from '../components/VendorDashboard/manage-product/ProductList';
import { fetchProducts } from '../services/fetchProducts';

jest.mock('../services/fetchProducts');

const mockFetchProducts = fetchProducts as jest.MockedFunction<typeof fetchProducts>;

const mockProducts = [
    {
        id: "1",
        name: "Product 1",
        price: "1000 ₹",
        imageUrl: "https://example.com/product1.jpg",
        productType: "Type 1",
        categories: "Category 1",
        manufacturer: "Manufacturer 1",
        countryOfOrigin: "Country 1"
    },
    {
        id: "2",
        name: "Product 2",
        price: "2000 ₹",
        imageUrl: "https://example.com/product2.jpg",
        productType: "Type 2",
        categories: "Category 2",
        manufacturer: "Manufacturer 2",
        countryOfOrigin: "Country 2"
    }
];


describe('ProductList Component', () => {
    beforeEach(() => {
        mockFetchProducts.mockResolvedValue(mockProducts);
    });

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        );
    };

    test('renders ProductList and fetches products', async () => {
        renderWithRouter(<ProductList />);

        expect(await screen.findByText('Product 1')).toBeInTheDocument();
        expect(await screen.findByText('Product 2')).toBeInTheDocument();
    });

    test('shows "No products found" when no products are available', async () => {
        mockFetchProducts.mockResolvedValue([]);

        renderWithRouter(<ProductList />);

        expect(await screen.findByText('No products found')).toBeInTheDocument();
    });
});

