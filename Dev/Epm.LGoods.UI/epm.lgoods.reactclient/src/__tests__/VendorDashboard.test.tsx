import React from 'react';
import { render, screen } from '@testing-library/react';
import VendorDashboard from '../components/VendorDashboard/VendorDashboard';


// Mock Header and Footer components
jest.mock('../components/Header', () => () => <div>Header Mock</div>);
jest.mock('../components/Footer', () => () => <div>Footer Mock</div>);

describe('VendorDashboard Component', () => {
    it('should render without crashing', () => {
        const { container } = render(<VendorDashboard />);
        expect(container).toBeInTheDocument();
    });

    it('should render the Header component', () => {
        const { getByText } = render(<VendorDashboard />);
        expect(screen.getByText('Header Mock')).toBeInTheDocument();
    });

    it('should render the Footer component', () => {
        const { getByText } = render(<VendorDashboard />);
        expect(screen.getByText('Footer Mock')).toBeInTheDocument();
    });

    it('should render the welcome message', () => {
        const { getByText } = render(<VendorDashboard />);
        expect(screen.getByText('Welcome to Vendor Dashboard...')).toBeInTheDocument();
    });
});
