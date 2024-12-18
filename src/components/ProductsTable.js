import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; 
import db from '../firebase'; // Import your Firebase config
import Modal from '../pages/Modal';
import UpdateProduct from '../components/ProductUpdateForm ';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const productsPerPage = 10;

  const fetchProducts = async () => {
    try {
      const productSnapshot = await getDocs(collection(db, "products"));
      const productList = productSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const calculateMarginProfit = (pricePerUnit, wholesalePrice) => {
    if (wholesalePrice && pricePerUnit) {
      return ((pricePerUnit - wholesalePrice) / wholesalePrice) * 100;
    }
    return 0;
  };
  const oneCaseCalculateMarginProfit = (bulkPricePerUnit, wholesalePrice) => {
    if (wholesalePrice && bulkPricePerUnit) {
      return ((bulkPricePerUnit - wholesalePrice) / wholesalePrice) * 100;
    }
    return 0;
  };

  const marginClass = (margin) => {
    if (margin <= 3) {
      return 'text-red-500 bg-red-200 rounded-lg '; // Red if margin is 3% or below
    } else if (margin >= 3.01 && margin <= 4.9) {
      return 'text-orange-500 bg-orange-200 rounded-lg'; // Orange if margin is between 3.01% and 4.9%
    } else if (margin >= 5 && margin <= 7) {
      return 'text-yellow-500 bg-yellow-200 rounded-lg' ; // Yellow if margin is between 5% and 7%
    } else if (margin >= 8) {
      return 'text-green-500 bg-green-200 rounded-lg'; // Green if margin is 8% or higher
    }
    return 'text-gray-600'; // Default gray if no margin
  };

  const handleView = (productId) => {
    console.log('View product', productId);
  };

  const handleDelete = (productId) => {
    console.log('Delete product', productId);
  };

  const filteredProducts = products.filter((product) => {
    return (
      (categoryFilter ? product.category === categoryFilter : true) &&
      (subcategoryFilter ? product.subcategory === subcategoryFilter : true) &&
      (searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true) // Filter by search query
    );
  });

  const categories = [...new Set(products.map(product => product.category))];
  const subcategories = [...new Set(products.map(product => product.subcategory))];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Product List</h2>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          {/* Search bar for name filtering */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name"
            className="border border-gray-300 p-2 rounded-md"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <>
          <table className="min-w-full table-auto border-collapse border border-blue-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Image</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Subcategory</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Brand</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Unit Type</th>
               
          
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Units per Case</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-blue-500">Wholesale Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold  text-white bg-violet-400">Price per Unit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold  text-white bg-violet-400">Margin Profit (%)</th> {/* New column */}
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-cyan-400">Bulk Price per Unit</th> {/* New column */}
                <th className="px-4 py-3 text-left text-sm font-semibold text-white bg-cyan-400">1case Margin Profit (%)</th> {/* New column */}
                <th className="px-4 py-3 text-sm font-semibold text-white bg-blue-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className=''>
            {currentProducts.map((product) => {
    const margin = calculateMarginProfit(product.pricing?.pricePerUnit, product.wholesalePricing?.pricePerUnit);
    const bulkPricePerUnit = product.pricing?.bulkPricing?.[0]?.bulkPricePerUnit; // Assuming first bulk pricing item
    const caseMargin = oneCaseCalculateMarginProfit(bulkPricePerUnit, product.wholesalePricing?.pricePerUnit); // Calculate 1case margin profit
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-center">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.subcategory}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.brand}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.unitType}</td>
                  
                
                    <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.unitsPerCase}</td>
                    <td className="px-6 py-4 text-sm text-gray-600  ">₱{product.wholesalePricing?.pricePerUnit?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900  bg-violet-100 ">₱{product.pricing?.pricePerUnit?.toFixed(2)}</td>
                    <td className='bg-violet-100 '> <span  className={`p-1 text-sm ${marginClass(margin)}`}>{margin.toFixed(2)}%</span></td> 
                 
                    <td className="px-6 py-4 text-sm text-gray-900 bg-cyan-100">
                      ₱{bulkPricePerUnit ? bulkPricePerUnit : 'N/A'} 
                    </td>
                    <td className='bg-cyan-100'>  <span className={`p-1 text-sm ${marginClass(caseMargin)}`}>
            {caseMargin.toFixed(2)}%
          </span></td> 
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleView(product.id)}
                          className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                          View 
                        </button>
                        <button
                          onClick={() => handleUpdate(product)} // Open the modal with the selected product
                          className="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                        >
                          Updt
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="mx-4 text-lg">{currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal for updating product */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedProduct && <UpdateProduct product={selectedProduct} closeModal={closeModal} />}
      </Modal>
    </div>
  );
};

export default ProductsTable;
