import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, getDoc, orderBy, query, where, doc, updateDoc, addDoc ,increment} from 'firebase/firestore';
import db from '../firebase';
import bg from '../assets/back2.png';

const Cart = () => {
  const [softDrinks, setSoftDrinks] = useState([]);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState('perPcs');
  const defaultFilters = {
    subcategoryFilter: ['Soft drinks', 'Water'],
    inputTypeFilter: ['Plastic Bottle'],
  };
  
  const defaultBundleFilters = {
    subcategoryFilter: ['Soft drinks','liquor','Spirits'],
    inputTypeFilter: ['Plastic Bottle', 'Bottle'],
  };
  
  const defaultCustomBundleFilters = {
    subcategoryFilter: ['Soft drinks'],
    inputTypeFilter: ['Bottle'],
  };
  
  const [filters, setFilters] = useState(defaultFilters);
  const [bundleFilter, setBundleFilter] = useState(defaultBundleFilters);
  const [customBundleFilters, setCustomBundleFilters] = useState(defaultCustomBundleFilters);
  
  const toggleView = (viewType) => {
    setView(viewType);
  
    // Reset filters to their default states when the view changes
    if (viewType === 'perPcs') {
      setFilters(defaultFilters);
    } else if (viewType === 'perBundle') {
      setBundleFilter(defaultBundleFilters);
    } else if (viewType === 'customBundle') {
      setCustomBundleFilters(defaultCustomBundleFilters);
    }
  };
  
  const [bundlePage, setBundlePage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [customBundlePage, setCustomBundlePage] = useState(1);

  const handleCustomBundleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    setCustomBundleFilters((prevFilters) => {
      const updatedFilter = checked
        ? [...prevFilters[name], value]
        : prevFilters[name].filter((item) => item !== value);

      return {
        ...prevFilters,
        [name]: updatedFilter,
      };
    });
  };

  const handleBundleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    setBundleFilter((prevFilter) => {
      if (name === 'subcategoryFilter') {
        const updatedSubcategory = checked
          ? [...prevFilter.subcategoryFilter, value]
          : prevFilter.subcategoryFilter.filter((subcategory) => subcategory !== value);

        return {
          ...prevFilter,
          subcategoryFilter: updatedSubcategory,
        };
      } else if (name === 'inputTypeFilter') {
        const updatedInputType = checked
          ? [...prevFilter.inputTypeFilter, value]
          : prevFilter.inputTypeFilter.filter((inputType) => inputType !== value);

        return {
          ...prevFilter,
          inputTypeFilter: updatedInputType,
        };
      }
      return prevFilter;
    });
  };

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;

    setFilters((prevFilters) => {
      if (name === 'subcategoryFilter') {
        const newSubcategoryFilter = checked
          ? [...prevFilters.subcategoryFilter, value]
          : prevFilters.subcategoryFilter.filter((subcategory) => subcategory !== value);

        return {
          ...prevFilters,
          subcategoryFilter: newSubcategoryFilter,
        };
      } else if (name === 'inputTypeFilter') {
        const newInputTypeFilter = checked
          ? [...prevFilters.inputTypeFilter, value]
          : prevFilters.inputTypeFilter.filter((inputType) => inputType !== value);

        return {
          ...prevFilters,
          inputTypeFilter: newInputTypeFilter,
        };
      }

      return prevFilters;
    });
  };

  // Memoize filtered products for customBundle view
  const filteredCustomBundleProducts = useMemo(() => {
    return softDrinks.filter((product) => {
      const matchesSubcategory = customBundleFilters.subcategoryFilter.length
        ? customBundleFilters.subcategoryFilter.includes(product.subcategory)
        : true;
      const matchesInputType = customBundleFilters.inputTypeFilter.length
        ? customBundleFilters.inputTypeFilter.includes(product.unitType)
        : true;

      return matchesSubcategory && matchesInputType;
    });
  }, [softDrinks, customBundleFilters]);

  // Memoize filtered products for perBundle view
  const filteredBundle = useMemo(() => {
    return softDrinks.filter((product) => {
      const matchesSubcategory = bundleFilter.subcategoryFilter.length
        ? bundleFilter.subcategoryFilter.includes(product.subcategory)
        : true;
      const matchesInputType = bundleFilter.inputTypeFilter.length
        ? bundleFilter.inputTypeFilter.includes(product.unitType)
        : true;

      return matchesSubcategory && matchesInputType;
    });
  }, [softDrinks, bundleFilter]);

  // Memoize filtered products for perPcs view
  const filteredProducts = useMemo(() => {
    return softDrinks.filter((product) => {
      const matchesSubcategory = filters.subcategoryFilter.length
        ? filters.subcategoryFilter.includes(product.subcategory)
        : true;
      const matchesInputType = filters.inputTypeFilter.length
        ? filters.inputTypeFilter.includes(product.unitType)
        : true;

      return matchesSubcategory && matchesInputType;
    });
  }, [softDrinks, filters]);

  const totalBundlePages = Math.ceil(filteredBundle.length / itemsPerPage);
  const currentBundles = filteredBundle.slice(
    (bundlePage - 1) * itemsPerPage,
    bundlePage * itemsPerPage
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalCustomBundlePages = Math.ceil(filteredCustomBundleProducts.length / itemsPerPage);
  const currentCustomBundles = filteredCustomBundleProducts.slice(
    (customBundlePage - 1) * itemsPerPage,
    customBundlePage * itemsPerPage
  );
  const handleCustomBundlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalCustomBundlePages) {
      setCustomBundlePage(newPage);
    }
  };
  

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const fetchSoftDrinks = async () => {
    try {
      const softDrinksQuery = query(
        collection(db, 'products'),
        where('category', '==', 'Beverages'),
        where('subcategory', 'in', ['Soft drinks', 'Water', 'liquor', 'Spirits']),
        orderBy('category', 'asc'),
        orderBy('purchaseCount', 'desc')
      );
      const querySnapshot = await getDocs(softDrinksQuery);
      const softDrinksList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setSoftDrinks(softDrinksList);
    } catch (error) {
      console.error('Error fetching soft drinks:', error);
    }
  };

  useEffect(() => {
    fetchSoftDrinks();
  }, []);

 

  const addToCart = (product) => {
    let priceToAdd = 0;
    let quantityToAdd = 1;
    let combinedName = product.name;
    let isBundle = false;
  
    const getPriceAndQuantity = () => {
      if (view === 'perPcs') {
        priceToAdd = parseFloat(product.pricing?.pricePerUnit) || 0;
      } else if (view === 'perBundle' || view === 'customBundle') {
        isBundle = true;
        const bulkPricing = product.pricing?.bulkPricing[0];
        if (bulkPricing) {
          priceToAdd = parseFloat(bulkPricing.bulkPricePerUnit) || 0;
          quantityToAdd = view === 'customBundle' ? 1 : parseInt(bulkPricing.quantity, 10) || 1;
          combinedName = `${product.name} (Bundle of ${quantityToAdd})`;
        }
      }
    };
  
    getPriceAndQuantity();
  
    if (quantityToAdd <= 0 || isNaN(priceToAdd)) {
      alert('Please enter valid pricing and quantity.');
      return;
    }
  
    const totalPriceToAdd = priceToAdd * quantityToAdd;
  
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id && item.isBundle === isBundle);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id && item.isBundle === isBundle
            ? {
                ...item,
                quantity: item.quantity + quantityToAdd,
                totalPrice: item.totalPrice + totalPriceToAdd,
              }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...product,
            isBundle,
            combinedName,
            price: priceToAdd,
            quantity: quantityToAdd,
            totalPrice: totalPriceToAdd,
          },
        ];
      }
    });
  };
  

  const updateQuantity = (productId, type) => {
    setCart(cart.map(item =>
      item.id === productId
        ? {
            ...item,
            quantity: type === 'increase' ? item.quantity + 1 : Math.max(item.quantity - 1, 1),
            totalPrice: (type === 'increase'
              ? item.totalPrice + item.price
              : Math.max(item.totalPrice - item.price, item.price)),
          }
        : item
    ));
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const proceedToCheckout = async () => {
    try {
      const totalPrice = cart.reduce((total, item) => {
        return total + (parseFloat(item?.totalPrice) || 0);
      }, 0);

      const saleData = {
        products: cart.map(item => ({
          productId: item.id || 'N/A',
          name: item.combinedName || item.name || 'Unnamed Product',
          price: item.price || 0,
          quantity: item.quantity || 1,
        })),
        totalPrice: totalPrice,
        date: new Date(),
        status: 'pending',
      };

      const salesRef = collection(db, 'sales');
      const docRef = await addDoc(salesRef, saleData);

      cart.forEach(async (item) => {
        const productRef = doc(db, 'products', item.id);
        await updateDoc(productRef, {
          purchaseCount: increment(item.quantity),
          stockInUnits: increment(-item.quantity),
        });
      });

      alert('Checkout successful!');
      setCart([]);
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };


  return (
    <div className='bg-gray-200 h-screen '>



      <div className="flex ">

        <div className="w-2/5 h-screen bg-gradient-to-r from-[#623288] to-[#4B0082] p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Your Cart</h2>
          {cart.length === 0 ? (
  <p className="text-white">Your cart is empty.</p>
) : (
  <div className="bg-white p-4 rounded-md shadow-md">
    <div className="max-h-[400px] overflow-y-auto">
      {cart.map((item, index) => (
        <div key={item.combinedName + index} className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="ml-4">
              <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              <p className="text-gray-600">
                ₱{!isNaN(item.totalPrice) ? item.totalPrice.toFixed(2) : '0.00'} total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, 'decrease')}
              className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, 'increase')}
              className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400"
            >
              +
            </button>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4">
      <p className="text-xl text-green-500 font-semibold">
        Total: ₱
        {cart.reduce((total, item) => {
          const itemTotalPrice = isNaN(item.totalPrice) ? 0 : item.totalPrice;
          return total + itemTotalPrice;
        }, 0).toFixed(2)}
      </p>

      <button
        onClick={proceedToCheckout}
        className="mt-4 w-full py-2 bg-[#623288] text-white rounded-md hover:bg-[#4B0082]"
      >
        Proceed to Checkout
      </button>
    </div>
  </div>
)}

        </div>

        <div className="w-full p-2 h-auto" style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="flex space-x-4 mb-6">
  <button
    onClick={() => toggleView('perPcs')}
    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
      view === 'perPcs' ? 'bg-[#623288] text-white shadow-lg' : 'bg-gray-700 text-white hover:bg-[#4B0082]'
    }`}
  >
    Per Pcs
  </button>
  <button
    onClick={() => toggleView('perBundle')}
    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
      view === 'perBundle' ? 'bg-[#623288] text-white shadow-lg' : 'bg-gray-700 text-white hover:bg-[#4B0082]'
    }`}
  >
    Per Bundle/Case
  </button>
  <button
    onClick={() => toggleView('customBundle')}
    className={`px-6 py-3 rounded-lg transition-all duration-300 ${
      view === 'customBundle' ? 'bg-[#623288] text-white shadow-lg' : 'bg-gray-700 text-white hover:bg-[#4B0082]'
    }`}
  >
    Custom Case
  </button>
</div>


          {/* Select Filters for PerPcs */}
          {view === 'perPcs' && (
  <div>
    {/* Subcategory Filters */}
    <div className="space-x-2 flex">
  <div>
    <div className="flex flex-wrap gap-4">
      <label className="flex items-center text-[#623288]">
        <input
          type="checkbox"
          value="Soft drinks"
          checked={filters.subcategoryFilter.includes('Soft drinks')}
          onChange={handleFilterChange}
          name="subcategoryFilter"
          className="mr-2"
        />
        Soft drinks
      </label>
      <label className="flex items-center text-[#623288]">
        <input
          type="checkbox"
          value="Dairy"
          checked={filters.subcategoryFilter.includes('Dairy')}
          onChange={handleFilterChange}
          name="subcategoryFilter"
          className="mr-2"
        />
        Dairy
      </label>
      <label className="flex items-center text-[#623288]">
        <input
          type="checkbox"
          value="liquor"
          checked={filters.subcategoryFilter.includes('liquor')}
          onChange={handleFilterChange}
          name="subcategoryFilter"
          className="mr-2"
        />
        liquor 
      </label>
      <label className="flex items-center text-[#623288]">
        <input
          type="checkbox"
          value="Water"
          checked={filters.subcategoryFilter.includes('Water')}
          onChange={handleFilterChange}
          name="subcategoryFilter"
          className="mr-2"
        />
        Water
      </label>
    </div>
  </div>

  {/* Input Type Filters */}
  <div className="space-y-2">
    <div className="flex flex-wrap gap-4">
      <label className="flex items-center text-[#623288]">
        <input
          type="checkbox"
          value="Plastic Bottle"
          checked={filters.inputTypeFilter.includes('Plastic Bottle')}
          onChange={handleFilterChange}
          name="inputTypeFilter"
          className="mr-2"
        />
        Plastic Bottle
      </label>
      <label className="flex items-center text-[#623288]">
        <input
          type="checkbox"
          value="Bottle"
          checked={filters.inputTypeFilter.includes('Bottle')}
          onChange={handleFilterChange}
          name="inputTypeFilter"
          className="mr-2"
        />
        Bottle
      </label>
    </div>
  </div>
</div>


    {/* Product Grid */}
    <div className="grid grid-cols-5 gap-2">
      {currentProducts.map((product) => (
        <div key={product.id} className="bg-[#1a1818] rounded-md p-4 text-center text-white">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-32 h-32 object-cover mx-auto"
          />
          <h3 className="mt-2 text-md font-semibold">{product.name}</h3>
          <button
            onClick={() => addToCart(product)}
            className="mt-2 px-4 py-2 bg-[#623288] text-white text-xs rounded-md hover:bg-[#4B0082]"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-center mt-4">
  {/* Previous Button */}
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 mx-2 bg-[#623288] text-white rounded-md disabled:opacity-50"
  >
    Previous
  </button>

  {/* Page Numbers */}
  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 mx-1 rounded-md ${
        currentPage === page ? 'bg-[#623288] text-white' : 'bg-gray-300'
      }`}
    >
      {page}
    </button>
  ))}

  {/* Next Button */}
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 mx-2 bg-[#623288] text-white rounded-md disabled:opacity-50"
  >
    Next
  </button>
</div>

  </div>
)}







{view === 'perBundle' && (
      <div>
       <div className="flex space-x-6 mb-4">
  {/* Subcategory Filters */}
  <div className="space-y-2">
    <div className="flex flex-wrap gap-4">
      {['Soft drinks','dairy', 'Water', 'liquor'].map((subcategory) => (
        <label key={subcategory} className="flex items-center text-[#623288]">
          <input
            type="checkbox"
            value={subcategory}
            checked={bundleFilter.subcategoryFilter.includes(subcategory)}
            onChange={handleBundleFilterChange}
            name="subcategoryFilter"
            className="mr-2"
          />
          {subcategory}
        </label>
      ))}
    </div>
  </div>

  {/* Input Type Filters */}
  <div className="space-y-2">
    <div className="flex flex-wrap gap-4">
      {['Plastic Bottle', 'Bottle'].map((inputType) => (
        <label key={inputType} className="flex items-center text-[#623288]">
          <input
            type="checkbox"
            value={inputType}
            checked={bundleFilter.inputTypeFilter.includes(inputType)}
            onChange={handleBundleFilterChange}
            name="inputTypeFilter"
            className="mr-2"
          />
          {inputType}
        </label>
      ))}
    </div>
  </div>
</div>


        {/* Display Filtered Bundles */}
        <div className="grid grid-cols-5 gap-2">
          {currentBundles.map((product) => (
            <div
              key={product.id}
              className="bg-[#1a1818] rounded-md p-4 text-center text-white"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 object-cover mx-auto"
              />
              <h3 className="mt-2 text-md font-semibold">{product.name}</h3>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 px-4 py-2 bg-[#623288] text-white text-xs rounded-md hover:bg-[#4B0082]"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
  <button
    onClick={() => setBundlePage((prev) => Math.max(prev - 1, 1))}
    disabled={bundlePage === 1}
    className="px-4 py-2 mx-2 bg-[#623288] text-white rounded-md disabled:opacity-50"
  >
    Previous
  </button>
  {Array.from({ length: totalBundlePages }, (_, index) => index + 1).map((page) => (
    <button
      key={page}
      onClick={() => setBundlePage(page)}
      className={`px-4 py-2 mx-1 rounded-md ${
        bundlePage === page ? 'bg-[#623288] text-white' : 'bg-gray-300'
      }`}
    >
      {page}
    </button>
  ))}
  <button
    onClick={() => setBundlePage((prev) => Math.min(prev + 1, totalBundlePages))}
    disabled={bundlePage === totalBundlePages}
    className="px-4 py-2 mx-2 bg-[#623288] text-white rounded-md disabled:opacity-50"
  >
    Next
  </button>
</div>

      </div>
    )}

{view === 'customBundle' && (
  <div>
    {/* Select Filters for Custom Bundle */}
    <div className="flex space-x-4 mb-4">
  {/* Subcategory Filters */}
  <div className="flex space-x-4">
    <label className="flex items-center text-[#623288]">
      <input
        type="checkbox"
        name="subcategoryFilter"
        value="Soft drinks"
        checked={customBundleFilters.subcategoryFilter.includes('Soft drinks')}
        onChange={handleCustomBundleFilterChange}
        className="mr-2"
      />
      Soft Drinks
    </label>
    <label className="flex items-center text-[#623288]">
      <input
        type="checkbox"
        name="subcategoryFilter"
        value="liquor"
        checked={customBundleFilters.subcategoryFilter.includes('liquor')}
        onChange={handleCustomBundleFilterChange}
        className="mr-2"
      />
      liquor
    </label>
  </div>

  {/* Input Type Filters */}
  <div className="flex space-x-4">
    <label className="flex items-center text-[#623288]">
      <input
        type="checkbox"
        name="inputTypeFilter"
        value="Bottle"
        checked={customBundleFilters.inputTypeFilter.includes('Bottle')}
        onChange={handleCustomBundleFilterChange}
        className="mr-2"
      />
      Bottle
    </label>
    <label className="flex items-center text-[#623288]">
      <input
        type="checkbox"
        name="inputTypeFilter"
        value="Plastic Bottle"
        checked={customBundleFilters.inputTypeFilter.includes('Plastic Bottle')}
        onChange={handleCustomBundleFilterChange}
        className="mr-2"
      />
      Plastic Bottle
    </label>
  </div>
</div>


    {/* Display filtered products */}
    <div className="grid grid-cols-5 gap-2">
      {currentCustomBundles
        .sort((a, b) => (b.unitsPerCase === 24 ? 1 : 0) - (a.unitsPerCase === 24 ? 1 : 0))
        .map((product) => (
          <div key={product.id} className="bg-[#1a1818] rounded-md p-4 text-center text-white">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-32 h-32 object-cover mx-auto"
            />
            <h3 className="mt-2 text-md font-semibold">{product.name}</h3>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 px-4 py-2 bg-[#623288] text-white text-xs rounded-md hover:bg-[#4B0082]"
            >
              Add to Cart
            </button>
          </div>
        ))}
    </div>

    {/* Pagination for customBundle view */}
    <div className="mt-4 flex justify-center space-x-2">
      {Array.from({ length: totalCustomBundlePages }, (_, index) => (
        <button
          key={index}
          onClick={() => handleCustomBundlePageChange(index + 1)}
          className={`px-4 py-2 rounded-md ${customBundlePage === index + 1 ? 'bg-[#623288] text-white' : 'bg-gray-200'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default Cart;