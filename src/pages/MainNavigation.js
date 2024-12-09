import React from 'react';
import { Link } from 'react-router-dom';

const MainNavigation = () => {
  return (
    <div className="fixed top-16 left-0 bg-white w-64 h-full flex flex-col shadow-md">
    
      <nav className="flex-grow flex flex-col space-y-3 mt-5">
        <Link to="/" className="text-black text-lg px-4 py-2 hover:bg-gray-200 transition duration-300">
          Home
        </Link>
    
        <Link to="/addproduct" className="text-black text-lg px-4 py-2 hover:bg-gray-200 transition duration-300">
          Add Product
        </Link>
      
        <Link to="/productlist" className="text-black text-lg px-4 py-2 hover:bg-gray-200 transition duration-300">
          Product List
        </Link>
        <Link to="/backup" className="text-black text-lg px-4 py-2 hover:bg-gray-200 transition duration-300">
          Backup Product
        </Link>
      </nav>
    </div>
  );
};

export default MainNavigation;
