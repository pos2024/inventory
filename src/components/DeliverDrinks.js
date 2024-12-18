import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import db from '../firebase';

const DeliverDrinks = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryStock, setDeliveryStock] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchBeverages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const drinks = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((product) => product.category === 'Beverages');
      setProducts(drinks);
      setFilteredProducts(drinks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeliverClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleSubmit = async () => {
    if (!deliveryStock || isNaN(deliveryStock) || parseInt(deliveryStock) <= 0) {
      setError('Please enter a valid stock amount.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const productRef = doc(db, 'products', selectedProduct.id);
      const newStock = selectedProduct.stock + parseInt(deliveryStock);
      const newStockInUnits = newStock * selectedProduct.unitsPerCase;

      await updateDoc(productRef, {
        stock: newStock,
        stockInUnits: newStockInUnits,
      });

      await addDoc(collection(db, 'delivery'), {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        addedStock: parseInt(deliveryStock),
        totalStock: newStock,
        totalStockInUnits: newStockInUnits,
        timestamp: new Date(),
      });

      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === selectedProduct.id
            ? { ...prod, stock: newStock, stockInUnits: newStockInUnits }
            : prod
        )
      );
      setFilteredProducts((prevFiltered) =>
        prevFiltered.map((prod) =>
          prod.id === selectedProduct.id
            ? { ...prod, stock: newStock, stockInUnits: newStockInUnits }
            : prod
        )
      );

      setIsModalOpen(false);
      setDeliveryStock('');
      alert('Stock updated and delivery logged successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeverages();
  }, []);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className='h-screen p-6'>
      <div className="max-w-4xl mx-auto mt-10 p-4 bg-gray-200 rounded-lg ">
      <h2 className="text-xl font-semibold text-center mb-4">Deliver Beverages</h2>
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded text-sm"
          placeholder="Search by product name..."
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-sm text-sm">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Stock in Units</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-100">
                <td className="p-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">{product.stockInUnits}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDeliverClick(product)}
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-sm"
                  >
                    Deliver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded"
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md text-sm">
            <h3 className="text-lg font-semibold mb-2">Update Stock</h3>
            <p className="text-gray-700 mb-2">
              <strong>Product:</strong> {selectedProduct.name}
            </p>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter Case/Bundle to add:
              </label>
              <input
                type="number"
                value={deliveryStock}
                onChange={(e) => setDeliveryStock(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded"
                placeholder="Enter stock amount"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`py-1 px-2 rounded text-white text-sm ${
                  loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default DeliverDrinks;
