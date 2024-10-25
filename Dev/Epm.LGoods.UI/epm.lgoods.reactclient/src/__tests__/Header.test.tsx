import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from '../components/Header';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Header Component', () => {
  const renderHeader = () => {
    render(
      <Router>
        <Header />
      </Router>
    );
  };

  test('renders the logo image with correct src and alt text', () => {
    renderHeader();
    const logo = screen.getByAltText('Local Goods Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', expect.stringContaining('localgoodslogo.webp'));
  });

  test('displays dropdown menu on mouse enter', async () => {
    renderHeader();
    const catalog = screen.getByText(/Catalog/i);

    // Simulate mouse enter
    fireEvent.mouseEnter(catalog);

    // Check for the presence of dropdown items
    await waitFor(() => {
      expect(screen.getByText('Manage Products')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });
  });

  test('hides dropdown menu on mouse leave', async () => {
    renderHeader();
    const catalog = screen.getByText(/Catalog/i);

    // Simulate mouse enter to show the dropdown
    fireEvent.mouseEnter(catalog);
    await waitFor(() => {
      expect(screen.getByText('Manage Products')).toBeInTheDocument();
    });

    // Simulate mouse leave to hide the dropdown
    fireEvent.mouseLeave(catalog);

    // Use separate `waitFor` calls for each assertion
    await waitFor(() => {
      expect(screen.queryByText('Manage Products')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText('Categories')).not.toBeInTheDocument();
    });
  });

  test('renders correct navigation links', async () => {
    renderHeader();

    // Make sure the dropdown is visible first
    const catalog = screen.getByText(/Catalog/i);
    fireEvent.mouseEnter(catalog);

    // Check for the correct navigation links
    const manageProductsLink = await screen.findByText('Manage Products');
    const categoriesLink = await screen.findByText('Categories');
    
    await waitFor(() => {
      expect(manageProductsLink).toHaveAttribute('href', '/manage-products');
    });

    await waitFor(() => {
      expect(categoriesLink).toHaveAttribute('href', '/categories');
    });
  });
});
