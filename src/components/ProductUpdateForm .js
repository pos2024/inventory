import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import db from '../firebase'; // Import your Firebase config
import { collection, getDocs, getDoc } from 'firebase/firestore'; // For fetching categories and subcategories

const UpdateProductForm = ({ product, closeModal }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [unitType, setUnitType] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [stockInUnits, setStockInUnits] = useState('');
  const [unitsPerCase, setUnitsPerCase] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Fetch categories and subcategories from Firestore
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.id, // Document ID is the category name
          subcategories: doc.data().subcategories || [] // Get subcategories from the document
        }));

        setCategories(categoriesData);

        // If a category is selected, fetch subcategories for that category
        if (product?.category) {
          const categoryDoc = categoriesData.find(cat => cat.id === product.category);
          if (categoryDoc && categoryDoc.subcategories) {
            setSubcategories(categoryDoc.subcategories);
          } else {
            setSubcategories([]); // No subcategories
          }
        }
      } catch (error) {
        console.error('Error fetching categories and subcategories:', error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []); // Empty array means this runs only once on component mount

  // Reset the form fields when the product prop changes
  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setSubcategory(product.subcategory || '');
      setBrand(product.brand || '');
      setUnitType(product.unitType || '');
      setPricePerUnit(product.pricing?.pricePerUnit || '');
      setWholesalePrice(product.wholesalePricing?.pricePerUnit || '');
      setStockInUnits(product.stockInUnits || '');
      setUnitsPerCase(product.unitsPerCase || '');
      setImageUrl(product.imageUrl || '');
    }
  }, [product]); // This will run whenever the 'product' prop changes

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch the current product data from Firestore
      const productRef = doc(db, 'products', product.id);
      const productSnapshot = await getDoc(productRef);
  
      if (!productSnapshot.exists()) {
        alert('Product does not exist!');
        return;
      }
  
      const currentData = productSnapshot.data();
  
      // Merge the updated fields with the existing data
      const updatedProduct = {
        ...currentData, // Preserve existing data
        name,
        category,
        subcategory,
        brand,
        unitType,
        pricing: {
          ...currentData.pricing, // Preserve nested pricing data
          pricePerUnit: Number(pricePerUnit),
        },
        wholesalePricing: {
          ...currentData.wholesalePricing, // Preserve nested wholesalePricing data
          pricePerUnit: Number(wholesalePrice),
        },
        stockInUnits: Number(stockInUnits),
        unitsPerCase: Number(unitsPerCase),
        imageUrl,
      };
  
      // Update the Firestore document
      await updateDoc(productRef, updatedProduct);
  
      if (closeModal) closeModal(); // Close the modal if provided
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };
  
  return (
    <div className="modal-content p-6 bg-white rounded shadow-lg w-full max-w-2xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className='flex space-x-5'>
          {/* left */}
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((categoryData) => (
                  <option key={categoryData.id} value={categoryData.id}>
                    {categoryData.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Select */}
            <div className="mb-4">
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                id="subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                disabled={!category} // Disable if no category is selected
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="unitType" className="block text-sm font-medium text-gray-700">Unit Type</label>
              <input
                type="text"
                id="unitType"
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* right */}
          <div>
            <div className="mb-4">
              <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">Price per Unit</label>
              <input
                type="number"
                id="pricePerUnit"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="wholesalePrice" className="block text-sm font-medium text-gray-700">Wholesale Price</label>
              <input
                type="number"
                id="wholesalePrice"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="stockInUnits" className="block text-sm font-medium text-gray-700">Stock in Units</label>
              <input
                type="number"
                id="stockInUnits"
                value={stockInUnits}
                onChange={(e) => setStockInUnits(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="unitsPerCase" className="block text-sm font-medium text-gray-700">Units per Case</label>
              <input
                type="number"
                id="unitsPerCase"
                value={unitsPerCase}
                onChange={(e) => setUnitsPerCase(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductForm;
