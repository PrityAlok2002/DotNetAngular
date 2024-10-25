import React from 'react';
import PriceForm from './PriceForm';
import { PriceFormData } from '../../types/type';
import "../../styles/parent-form.css";
import Header from '../Header';
import Footer from '../Footer';

const ParentComponent: React.FC = () => {
  const handleFormSubmit = (data: PriceFormData) => {
  };

  return (
    <>
     <Header />
    <div>
      <PriceForm onSubmit={handleFormSubmit} />
    </div>
    <Footer />
    </>
  )
};

export default ParentComponent;
