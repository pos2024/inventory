import React, { useState, useEffect } from 'react';
import db from '../firebase';
import { collection, addDoc, writeBatch, Timestamp, getDocs, doc, getDoc } from 'firebase/firestore';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [unitType, setUnitType] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [bulkPricing, setBulkPricing] = useState([{ quantity: '', price: '', description: '' }]);
  const [wholesalePricing, setWholesalePricing] = useState({ pricePerUnit: '' });
  const [stock, setStock] = useState('');
  const [unitsPerCase, setUnitsPerCase] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSoldByPiece, setIsSoldByPiece] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchCategories = async () => {
    const categorySnapshot = await getDocs(collection(db, 'categories'));
    const categoriesList = categorySnapshot.docs.map(doc => doc.id);
    setCategories(categoriesList);
  };

  const fetchSubcategories = async (category) => {
    if (!category) return;
    const categoryRef = doc(db, 'categories', category);
    const categoryDoc = await getDoc(categoryRef);
    const subcategoriesList = categoryDoc.exists() ? categoryDoc.data().subcategories : [];
    setSubcategories(subcategoriesList);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    fetchSubcategories(selectedCategory);
  };

  const handleBulkPricingChange = (index, field, value) => {
    const updatedBulkPricing = [...bulkPricing];
    updatedBulkPricing[index][field] = value;
    updatedBulkPricing[index].bulkPricePerUnit =
      updatedBulkPricing[index].price && updatedBulkPricing[index].quantity
        ? (parseFloat(updatedBulkPricing[index].price) / parseInt(updatedBulkPricing[index].quantity)).toFixed(2)
        : '';
    setBulkPricing(updatedBulkPricing);
  };

  const handleAddBulkPricing = () => {
    setBulkPricing([...bulkPricing, { quantity: '', price: '', description: '', bulkPricePerUnit: '' }]);
  };

  const handleRemoveBulkPricing = (index) => {
    const updatedBulkPricing = bulkPricing.filter((_, i) => i !== index);
    setBulkPricing(updatedBulkPricing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const batch = writeBatch(db);
      const productRef = collection(db, 'products');
      const stockInUnits = isSoldByPiece ? parseInt(stock) : parseInt(stock) * parseInt(unitsPerCase);

      const newProduct = {
        name,
        category,
        subcategory,
        brand,
        unitType,
        pricing: {
          pricePerUnit: parseFloat(pricePerUnit),
          bulkPricing
        },
        wholesalePricing: {
          pricePerUnit: parseFloat(wholesalePricing.pricePerUnit)
        },
        stock: parseInt(stock),
        unitsPerCase: isSoldByPiece ? 1 : parseInt(unitsPerCase),
        stockInUnits,
        imageUrl,
        purchaseCount: 0, // Default value added here
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(productRef, newProduct);
      batch.commit();

      setLoading(false);
      setName('');
      setCategory('');
      setSubcategory('');
      setBrand('');
      setUnitType('');
      setPricePerUnit('');
      setBulkPricing([{ quantity: '', price: '', description: '' }]);
      setWholesalePricing({ pricePerUnit: '' });
      setStock('');
      setUnitsPerCase('');
      setImageUrl('');
      setIsSoldByPiece(false);
      alert('Product added successfully!');
    } catch (error) {
      setLoading(false);
      setError('Error adding product');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);


  return (
    <div className="w-auto min-h-max p-4    ">
     
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form className="w-full max-w-4xl  bg-white shadow-lg rounded-lg p-8 space-y-6" onSubmit={handleSubmit}>
  <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mx-auto">
    {/* Left Section */}
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Subcategory</label>
        <select
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          disabled={!category}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Unit Type</label>
        <input
          type="text"
          value={unitType}
          onChange={(e) => setUnitType(e.target.value)}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price Per Unit</label>
        <input
          type="number"
          value={pricePerUnit}
          onChange={(e) => setPricePerUnit(e.target.value)}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
    </div>

    {/* Right Section */}
    <div className="space-y-4  ">
      <div>
        <label className="block text-sm font-medium text-gray-700">Bulk Pricing</label>
        {bulkPricing.map((bulk, index) => (
          <div key={index} className="space-y-2">
            <div className="flex flex-col space-y-2">

             <div className='flex space-x-2'>
             <input
                type="number"
                placeholder="Quantity"
                value={bulk.quantity}
                onChange={(e) => handleBulkPricingChange(index, 'quantity', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={bulk.price}
                onChange={(e) => handleBulkPricingChange(index, 'price', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              </div>

            {/* 2nd */}
          <div className='flex space-x-2'>
          <input
                type="text"
                placeholder="Description"
                value={bulk.description}
                onChange={(e) => handleBulkPricingChange(index, 'description', e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveBulkPricing(index)}
               className="bg-red-500 text-white py-2 px-4 rounded-lg mt-2 focus:ring focus:ring-red-300 focus:outline-none"
              >
               Remove
              </button>
              <button
          type="button"
          onClick={handleAddBulkPricing}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 focus:ring focus:ring-blue-300 focus:outline-none"
        >
          AddMore
        </button>
            </div>
            </div>
          </div>
        ))}
        
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Wholesale Pricing</label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Price Per Unit"
            value={wholesalePricing.pricePerUnit}
            onChange={(e) => setWholesalePricing({ ...wholesalePricing, pricePerUnit: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Units per Case</label>
        <input
          type="number"
          value={unitsPerCase}
          onChange={(e) => setUnitsPerCase(e.target.value)}
          required={!isSoldByPiece}
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
          disabled={isSoldByPiece}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Sold by Piece</label>
        <input
          type="checkbox"
          checked={isSoldByPiece}
          onChange={() => setIsSoldByPiece(!isSoldByPiece)}
          className="mt-1 w-6 h-6"
        />
      </div>
    </div>
  </div>
  <button
    type="submit"
    className="max-w-max bg-blue-600  mx-auto text-white p-2 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:ring focus:ring-blue-300 focus:outline-none"
  >
    Add Product
  </button>
</form>

    </div>
  );
};

export default AddProduct;