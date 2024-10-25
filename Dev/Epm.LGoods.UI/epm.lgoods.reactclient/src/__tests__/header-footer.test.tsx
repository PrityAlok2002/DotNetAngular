import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

describe('Header', () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  test('renders logo image', () => {
    setup();
    const logo = screen.getByAltText(/Local Goods Logo/i);
    expect(logo).toBeInTheDocument();
  });


});


describe('Footer', () => {
    render(<Footer />);
});