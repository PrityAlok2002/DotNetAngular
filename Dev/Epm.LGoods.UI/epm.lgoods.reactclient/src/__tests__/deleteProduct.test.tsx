import { deleteProduct } from '../services/deleteProducts';

describe('deleteProduct', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('calls fetch with correct URL and method', async () => {
    const productId = '123';
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await deleteProduct(productId);

    expect(global.fetch).toHaveBeenCalledWith(`http://localhost:5000/products`, {
      method: 'DELETE',
    });
  });

  test('handles fetch error', async () => {
    const productId = '123';
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Failed to delete'));

    await expect(deleteProduct(productId)).rejects.toThrow('Failed to delete');
  });
});