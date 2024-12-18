import React, { useEffect, useState } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom'; 
import Login from './components/Login';
import RootLayout from './pages/Root';
import Cart from './components/Cart'
import ProductTable from './components/ProductsTable'
import SoftDrinksTable from './components/SoftDrinksTable'
import DownloadProducts from './components/DownloadProducts'
import UpdatePrice from './components/UpdatePrice'
import Sales from './components/Sales';
import AddCategoryAndSubcategory from './components/AddCategoryAndSubcategory'
import AddProduct from './components/AddProduct'
import AdminDashboard from './pages/AdminDashboard';
import AddProdCate from './pages/AddProdCate';
import SalesReport from './pages/SalesReport';
import ProductList from './pages/ProductList';
import DeliverDrinks from './components/DeliverDrinks';




const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserRole(user.role);
    }
    setLoading(false);
  }, []);

  
  const adminRouter = createHashRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element:<SalesReport/>  },
        {path: '/addproduct', element:<AddProdCate/> },

        { path: '/backup', element: <DownloadProducts/>},
        {path: '/productlist', element: <ProductList/>},
          {path: 'delivery', element:<DeliverDrinks/> }
      
      ],
    },
  ]);

  const staffRouter = createHashRouter([
    {
      path: '/',
      element: <Cart/>,
    },
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userRole === null ? (
        <Login />
      ) : (
        <RouterProvider router={userRole === 'admin' ? adminRouter : staffRouter} />
      )}

        {/* <Cart/>
        <ProductTable/>
        <SoftDrinksTable/>
        <DownloadProducts/>
        <UpdatePrice/>
        <Sales/>
        <AddCategoryAndSubcategory/>
        <AddProduct/> */}

    </>
  );
};

export default App;
