import React, { useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import db from '../firebase'; // Adjust the path to your Firebase configuration

const UpdateBulkPricing = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const updateBulkPricing = async () => {
    setLoading(true);
    setStatus('Checking products...');
    try {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);

      const updates = [];
      productsSnapshot.forEach((productDoc) => {
        const productData = productDoc.data();
        const pricing = productData.pricing;

        if (pricing && !pricing.bulkPricing) {
          const updatedPricing = {
            ...pricing,
            bulkPricing: [
              {
                price: 195,
                description: '1 bundle',
                bulkPricePerUnit: 16.25,
                quantity: 12,
              },
            ],
          };

          // Prepare update operation
          updates.push(
            updateDoc(doc(db, 'products', productDoc.id), {
              pricing: updatedPricing,
            })
          );
        }
      });

      // Execute all updates
      await Promise.all(updates);

      setStatus('All products checked and updated successfully!');
    } catch (error) {
      console.error('Error updating bulk pricing:', error);
      setStatus('Error updating products.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Update Bulk Pricing</h1>
      <button
        onClick={updateBulkPricing}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Bulk Pricing'}
      </button>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
};

export default UpdateBulkPricing;
