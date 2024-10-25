// // services/__tests__/fetchProducts.test.ts
import { Filters } from '../types/type';
import { Products } from '../types/type';
import { fetchProducts } from '../services/fetchProducts';
// // Mock data to use in tests
const mockData: Products[] = [
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
jest.mock('../data', () => ({
    data: [
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
    ]
}));
describe('fetchProducts', () => {
    test('returns all products when no filters are applied', async () => {
        const filters: Filters = {
            productType: "",
            categories: "",
            manufacturer: "",
            countryOfOrigin: "",
            price: ""
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual(mockData);
    });

    test('filters products by product type', async () => {
        const filters: Filters = {
            productType: "Type 1",
            categories: "",
            manufacturer: "",
            countryOfOrigin: "",
            price: ""
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([mockData[0]]);
    });

    test('filters products by categories', async () => {
        const filters: Filters = {
            productType: "",
            categories: "Category 2",
            manufacturer: "",
            countryOfOrigin: "",
            price: ""
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([mockData[1]]);
    });

    test('filters products by manufacturer', async () => {
        const filters: Filters = {
            productType: "",
            categories: "",
            manufacturer: "Manufacturer 1",
            countryOfOrigin: "",
            price: ""
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([mockData[0]]);
    });

    test('filters products by country of origin', async () => {
        const filters: Filters = {
            productType: "",
            categories: "",
            manufacturer: "",
            countryOfOrigin: "Country 2",
            price: ""
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([mockData[1]]);
    });

    test('filters products by price', async () => {
        const filters: Filters = {
            productType: "",
            categories: "",
            manufacturer: "",
            countryOfOrigin: "",
            price: "2000"
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([mockData[1]]);
    });

    test('filters products by multiple criteria', async () => {
        const filters: Filters = {
            productType: "Type 2",
            categories: "Category 2",
            manufacturer: "Manufacturer 2",
            countryOfOrigin: "Country 2",
            price: "2000"
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([mockData[1]]);
    });

    test('returns no products when filters do not match any product', async () => {
        const filters: Filters = {
            productType: "Nonexistent Type",
            categories: "",
            manufacturer: "",
            countryOfOrigin: "",
            price: "1500-2000"
        };

        const products = await fetchProducts(filters);

        expect(products).toEqual([]);
    });
});



