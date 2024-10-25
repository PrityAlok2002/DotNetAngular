import axios from 'axios';
import { createProduct } from '../services/productCreationPostCall';

jest.mock('axios');

describe('createProduct', () => {
  const formData = new FormData();
  formData.append('name', 'Test Product');

  it('should make a POST request with the correct URL and data', async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: 'mocked response' });

    await createProduct(formData);

    expect(axios.post).toHaveBeenCalledWith('http://localhost:5292/api/products', formData);
  });

  it('should return the correct response when the request is successful', async () => {
    const mockedResponse = { data: 'mocked response' };
    (axios.post as jest.Mock).mockResolvedValue(mockedResponse);

    const response = await createProduct(formData);

    expect(response).toEqual(mockedResponse);
  });

});