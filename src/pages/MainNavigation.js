import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome, AiOutlineAppstore, AiOutlineUnorderedList, AiOutlineDropbox, AiOutlineCloudDownload } from 'react-icons/ai';

const MainNavigation = () => {
  return (
    <div className="fixed top-0 left-0 bg-blue-500 w-1/6 h-full flex flex-col shadow-lg text-white">
      <div className="flex items-center justify-center h-16 bg-blue-500 shadow-md">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      <nav className="flex-grow flex flex-col mt-5 space-y-2">
        <Link
          to="/"
          className="flex items-center px-4 py-3 hover:bg-blue-700 transition duration-300"
        >
          <AiFillHome className="mr-3 text-xl" />
          <span className="text-base">Home</span>
        </Link>
        
        <Link
          to="/addproduct"
          className="flex items-center px-4 py-3 hover:bg-blue-700 transition duration-300"
        >
          <AiOutlineAppstore className="mr-3 text-xl" />
          <span className="text-base">Add Product</span>
        </Link>

        <Link
          to="/productlist"
          className="flex items-center px-4 py-3 hover:bg-blue-700 transition duration-300"
        >
          <AiOutlineUnorderedList className="mr-3 text-xl" />
          <span className="text-base">Product List</span>
        </Link>

        <Link
          to="/delivery"
          className="flex items-center px-4 py-3 hover:bg-blue-700 transition duration-300"
        >
          <AiOutlineDropbox className="mr-3 text-xl" />
          <span className="text-base">Delivery</span>
        </Link>

        <Link
          to="/backup"
          className="flex items-center px-4 py-3 hover:bg-blue-700 transition duration-300"
        >
          <AiOutlineCloudDownload className="mr-3 text-xl" />
          <span className="text-base">Backup Product</span>
        </Link>
      </nav>

      <div className="mt-auto mb-5 px-4">
        <p className="text-sm text-blue-300">© 2024 Bullshit</p>
      </div>
    </div>
  );
};

export default MainNavigation;
