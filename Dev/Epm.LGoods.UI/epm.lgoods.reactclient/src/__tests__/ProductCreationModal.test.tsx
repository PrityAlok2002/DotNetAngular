import { render, screen, fireEvent } from '@testing-library/react';
import ProductCreationModal from '../components/VendorDashboard/product-creation-modal/ProductCreationModal';
import { createProduct } from '../services/productCreationPostCall';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosResponse } from 'axios';

jest.mock('../services/productCreationPostCall');

describe('ProductCreationModal', () => {
  const closeModal = jest.fn();

  const setup = () => {
    render(
      <>
        <ProductCreationModal closeModal={closeModal} />
        <ToastContainer />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the modal with all form fields', () => {
    setup();

    expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Short Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Manufacturing Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiry Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country of Origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stock Quantity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Length/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
  });

  test('validates required fields on form submission', async () => {
    setup();

    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Product Type is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Product Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Short Description is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Country of Origin is required/i)).toBeInTheDocument();
  });

  test('validates stock quantity as positive non-decimal value', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '10.5' } });
    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Stock Quantity only accepts positive non-decimal values/i)).toBeInTheDocument();
  });

  test('validates decimal fields as positive values', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '-1' } });
    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Only accepts positive values/i)).toBeInTheDocument();
  });

  test('submits the form with valid data', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Product Type/i), { target: { value: 'Electronics' } });
    fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Smartphone' } });
    fireEvent.change(screen.getByLabelText(/Short Description/i), { target: { value: 'Latest model' } });
    fireEvent.change(screen.getByLabelText(/Country of Origin/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '0.5' } });
    fireEvent.change(screen.getByLabelText(/Length/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Width/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '1' } });

    (createProduct as jest.MockedFunction<typeof createProduct>).mockResolvedValue({
      data: {},
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {},
    } as AxiosResponse);

    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Product created successfully/i)).toBeInTheDocument();
    expect(createProduct).toHaveBeenCalledTimes(1);
    expect(createProduct).toHaveBeenCalledWith(expect.any(FormData));
  });

  test('handles form submission failure', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/Product Type/i), { target: { value: 'Electronics' } });
    fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Smartphone' } });
    fireEvent.change(screen.getByLabelText(/Short Description/i), { target: { value: 'Latest model' } });
    fireEvent.change(screen.getByLabelText(/Country of Origin/i), { target: { value: 'USA' } });
    fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '0.5' } });
    fireEvent.change(screen.getByLabelText(/Length/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Width/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '1' } });

    (createProduct as jest.MockedFunction<typeof createProduct>).mockResolvedValue({
      data: {},
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {},
    } as AxiosResponse);

    fireEvent.click(screen.getByText(/Submit/i));

    expect(await screen.findByText(/Failed to create product/i)).toBeInTheDocument();
    expect(createProduct).toHaveBeenCalledTimes(1);
  });
});

// import { render, screen, fireEvent } from '@testing-library/react';
// import ProductCreationModal from '../components/VendorDashboard/product-creation-modal/ProductCreationModal';
// import { createProduct } from '../services/productCreationPostCall';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { AxiosResponse } from 'axios';

// jest.mock('../services/productCreationPostCall');

// describe('ProductCreationModal', () => {
//   const closeModal = jest.fn();

//   const setup = () => {
//     render(
//       <>
//         <ProductCreationModal closeModal={closeModal} />
//         <ToastContainer />
//       </>
//     );
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('renders the modal with all form fields', () => {
//     setup();

//     expect(screen.getByText(/Add New Product/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Product Type/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Short Description/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Manufacturing Date/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Expiry Date/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Country of Origin/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Stock Quantity/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Length/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Width/i)).toBeInTheDocument();
//     expect(screen.getByLabelText(/Height/i)).toBeInTheDocument();
//   });

//   test('validates required fields on form submission', async () => {
//     setup();

//     fireEvent.click(screen.getByText(/Submit/i));

//     expect(await screen.findByText(/Product Type is required/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Product Name is required/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Short Description is required/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Country of Origin is required/i)).toBeInTheDocument();
//   });

//   test('validates stock quantity as positive non-decimal value', async () => {
//     setup();

//     fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '10.5' } });
//     fireEvent.click(screen.getByText(/Submit/i));

//     expect(await screen.findByText(/Stock Quantity only accepts positive non-decimal values/i)).toBeInTheDocument();
//   });

//   test('validates decimal fields as positive values', async () => {
//     setup();

//     fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '-1' } });
//     fireEvent.click(screen.getByText(/Submit/i));

//     expect(await screen.findByText(/Only accepts positive values/i)).toBeInTheDocument();
//   });

//   test('submits the form with valid data', async () => {
//     setup();

//     fireEvent.change(screen.getByLabelText(/Product Type/i), { target: { value: 'Electronics' } });
//     fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Smartphone' } });
//     fireEvent.change(screen.getByLabelText(/Short Description/i), { target: { value: 'Latest model' } });
//     fireEvent.change(screen.getByLabelText(/Country of Origin/i), { target: { value: 'USA' } });
//     fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '100' } });
//     fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '0.5' } });
//     fireEvent.change(screen.getByLabelText(/Length/i), { target: { value: '10' } });
//     fireEvent.change(screen.getByLabelText(/Width/i), { target: { value: '5' } });
//     fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '1' } });

//     const mockResponse: AxiosResponse = {
//       data: {},
//       status: 201,
//       statusText: 'Created',
//       headers: { 'Content-Type': 'application/json' },
//       config: {}
//     };

//     (createProduct as jest.MockedFunction<typeof createProduct>).mockResolvedValue(mockResponse);

//     fireEvent.click(screen.getByText(/Submit/i));

//     expect(await screen.findByText(/Product created successfully/i)).toBeInTheDocument();
//     expect(createProduct).toHaveBeenCalledTimes(1);
//     expect(createProduct).toHaveBeenCalledWith(expect.any(FormData));
//     expect(closeModal).toHaveBeenCalledTimes(1);
//   });

//   test('handles form submission failure', async () => {
//     setup();

//     fireEvent.change(screen.getByLabelText(/Product Type/i), { target: { value: 'Electronics' } });
//     fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Smartphone' } });
//     fireEvent.change(screen.getByLabelText(/Short Description/i), { target: { value: 'Latest model' } });
//     fireEvent.change(screen.getByLabelText(/Country of Origin/i), { target: { value: 'USA' } });
//     fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '100' } });
//     fireEvent.change(screen.getByLabelText(/Weight/i), { target: { value: '0.5' } });
//     fireEvent.change(screen.getByLabelText(/Length/i), { target: { value: '10' } });
//     fireEvent.change(screen.getByLabelText(/Width/i), { target: { value: '5' } });
//     fireEvent.change(screen.getByLabelText(/Height/i), { target: { value: '1' } });

//     const mockErrorResponse: AxiosResponse = {
//       data: {},
//       status: 400,
//       statusText: 'Bad Request',
//       headers: { 'Content-Type': 'application/json' },
//       config: {}
//     };

//     (createProduct as jest.MockedFunction<typeof createProduct>).mockResolvedValue(mockErrorResponse);

//     fireEvent.click(screen.getByText(/Submit/i));

//     expect(await screen.findByText(/Failed to create product/i)).toBeInTheDocument();
//     expect(createProduct).toHaveBeenCalledTimes(1);
//   });
// });

