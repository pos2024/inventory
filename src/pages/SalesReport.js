import React from 'react';
import Sales from '../components/Sales';
import SalesCategories from '../components/SalesCategories';

const SalesReport = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-gray-200">
      <div className="flex justify-center items-center">
        <SalesCategories />
      </div>
      <div className="flex justify-center items-center p-6 h-auto">
        <Sales />
      </div>
    </div>
  );
};

export default SalesReport;
