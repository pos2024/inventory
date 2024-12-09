import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import db from '../firebase';

const SoftDrinksTable = () => {
  const [softDrinks, setSoftDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch Soft Drinks from Firestore
  const fetchSoftDrinks = async () => {
    try {
      const softDrinksQuery = query(
        collection(db, 'products'),
        where('category', '==', 'Beverages'),
        where('subcategory', '==', 'Soft drinks')
      );
      const querySnapshot = await getDocs(softDrinksQuery);
      const softDrinksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      softDrinksList.forEach(async (product) => {
        const updatedStock = Math.floor(product.stockInUnits / product.unitsPerCase);
        await updateDoc(doc(db, 'products', product.id), {
          stock: updatedStock,
        });
      });

      setSoftDrinks(softDrinksList);
    } catch (error) {
      console.error('Error fetching soft drinks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStockDisplay = (stockInUnits, unitsPerCase) => {
    if (isNaN(stockInUnits) || isNaN(unitsPerCase) || unitsPerCase === 0) {
      return 'Invalid stock data';
    }
    const cases = Math.floor(stockInUnits / unitsPerCase);
    const remainingUnits = stockInUnits % unitsPerCase;

    return remainingUnits > 0
      ? `${cases} Case/Bundle (${remainingUnits} pcs bottle)`
      : `${cases} Case/Bundle`;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to the first page on a new search
  };

  // Calculate filtered items based on search query
  const filteredSoftDrinks = softDrinks.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredSoftDrinks.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredSoftDrinks.length / itemsPerPage);

  useEffect(() => {
    fetchSoftDrinks();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-10 mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Soft Drinks Inventory</h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          className="w-2/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-left text-sm text-gray-700">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-3 py-2 border-b font-medium">Image</th>
              <th className="px-3 py-2 border-b font-medium">Product Name</th>
              <th className="px-3 py-2 border-b font-medium">Brand</th>
              <th className="px-3 py-2 border-b font-medium">Price</th>
              <th className="px-3 py-2 border-b font-medium">Stock</th>
              <th className="px-3 py-2 border-b font-medium">Stock in Units</th>
              <th className="px-3 py-2 border-b font-medium">Unit Type</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => {
              const stockDisplay = calculateStockDisplay(product.stockInUnits, product.unitsPerCase);

              return (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="px-3 py-2 border-b">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 border-b max-w-[150px] break-words">{product.name}</td>
                  <td className="px-3 py-2 border-b max-w-[120px] break-words">{product.brand}</td>
                  <td className="px-3 py-2 border-b">₱{product.pricing?.pricePerUnit || 'N/A'}</td>
                  <td className="px-3 py-2 border-b max-w-[150px]">{stockDisplay}</td>
                  <td className="px-3 py-2 border-b">{product.stockInUnits}</td>
                  <td className="px-3 py-2 border-b max-w-[120px] break-words">{product.unitType}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoftDrinksTable;
