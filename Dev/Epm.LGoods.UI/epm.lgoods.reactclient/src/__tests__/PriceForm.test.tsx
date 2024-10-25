import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import PriceForm from '../components/PriceMapping/PriceForm';

jest.mock('axios');

describe('PriceForm', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const onSubmit = jest.fn();

  beforeEach(() => {
    mockedAxios.post.mockReset();
    onSubmit.mockClear();
  });

  test('renders form inputs correctly', () => {
    render(<PriceForm onSubmit={onSubmit} />);

    expect(screen.getByPlaceholderText('Enter price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter discount percentage')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Effective Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter product ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter vendor ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(<PriceForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Price is required.')).toBeInTheDocument();
      // expect(screen.getByText('Currency is required.')).toBeInTheDocument();
      // expect(screen.getByText('Discount Percentage is required.')).toBeInTheDocument();
      // expect(screen.getByText('Product ID is required.')).toBeInTheDocument();
      // expect(screen.getByText('Vendor ID is required.')).toBeInTheDocument();
    });
  });

  test('submits the form successfully', async () => {
     render(<PriceForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: "1000" } });
    fireEvent.change(screen.getByPlaceholderText('Enter discount percentage'), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText('Enter product ID'), { target: { value: "12345" } });
    fireEvent.change(screen.getByPlaceholderText('Enter vendor ID'), { target: { value: "67890" } });
    fireEvent.change(screen.getByDisplayValue('INR'), { target: { value: 'USD' } });

    mockedAxios.post.mockResolvedValueOnce({ statusText: 'OK', data: { id: 1 } });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5292/api/Prices', {
        priceAmount: "1000",
        currency: 'USD',
        discountPercentage: "10",
        effectivePrice: 900,
        productId: "12345",
        vendorId: "67890",
      });
      // expect(onSubmit).toHaveBeenCalledWith({ id: 1 });
      // expect(screen.getByText('Price added successfully.')).toBeInTheDocument();
    });
  });

  test('handles form submission error', async () => {
    render(<PriceForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: 1000 } });
    fireEvent.change(screen.getByPlaceholderText('Enter discount percentage'), { target: { value: 10 } });
    fireEvent.change(screen.getByPlaceholderText('Enter product ID'), { target: { value: 12345} });
    fireEvent.change(screen.getByPlaceholderText('Enter vendor ID'), { target: { value: 67890 } });
    fireEvent.change(screen.getByDisplayValue('INR'), { target: { value: 'USD' } });

    mockedAxios.post.mockRejectedValueOnce(new Error('Failed to submit the form'));

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to submit the form. Please try again.')).toBeInTheDocument();
    });
  });

  test('calculates effective price correctly', () => {
    render(<PriceForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: 1000 } });
    fireEvent.change(screen.getByPlaceholderText('Enter discount percentage'), { target: { value: 10 } });

    expect(screen.getByPlaceholderText('Effective Price')).toHaveValue(900);
  });
});
