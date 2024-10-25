import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminDashboard from '../pages/AdminDashboard';
import ForgotPassword from '../pages/ForgotPassword';
import RegistrationForm from '../pages/RegistrationPage';
import ProductList from '../components/VendorDashboard/manage-product/ProductList';
import CategoriesList from '../components/VendorDashboard/Categories/CategoriesList';
import VendorDashboard from '../components/VendorDashboard/VendorDashboard';
import ParentComponent from '../components/PriceMapping/ParentForm';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/vendor-dashboard" element={< VendorDashboard/>} />
      <Route path="/manage-products" element={< ProductList />} />
      <Route path="/categories" element={< CategoriesList />} />
      <Route path="/product-list" element={< ProductList />} />
      <Route path="/price-mapping" element={< ParentComponent />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/sign-up" element={<RegistrationForm />} />
    </Routes>
  );
};

export default AppRoutes;

