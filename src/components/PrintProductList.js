import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PrintProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [unitTypeFilter, setUnitTypeFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setFilteredProducts(productList); // Initialize with full product list
    };

    fetchProducts();
  }, []);

  // Handle filter changes
  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setUnitTypeFilter(filterValue);

    if (filterValue === "") {
      setFilteredProducts(products); // Reset to full list
    } else {
      const filtered = products.filter((product) => product.unitType === filterValue);
      setFilteredProducts(filtered);
    }
  };

  const handlePrint = () => {
    const tableElement = document.getElementById("product-table");
    html2canvas(tableElement, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const position = 10; // Starting position from top
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      pdf.save("product-list.pdf");
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Product List</h2>
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Filter by Unit Type:</label>
        <select
          value={unitTypeFilter}
          onChange={handleFilterChange}
          className="px-4 py-2 border rounded"
        >
          <option value="">All</option>
          <option value="Bottle">Bottle</option>
          <option value="Plastic Bottle">Plastic Bottle</option>
        </select>
      </div>
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Print to PDF
      </button>
      <div className="overflow-x-auto">
        <table id="product-table" className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Unit Type</th>
              <th className="border border-gray-300 px-4 py-2">Price Per Unit</th>
              <th className="border border-gray-300 px-4 py-2">Price Case/Bundle</th>
              <th className="border border-gray-300 px-4 py-2">Pcs Per Case/Bundle</th>
              <th className="border border-gray-300 px-4 py-2">Retail Price</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const bulkPricing = product.pricing?.bulkPricing || [];
              const priceCaseBundle = bulkPricing.length > 0 ? bulkPricing[0].price : "N/A"; // Fetch `price` directly
              const unitsPerCase = product.unitsPerCase || 0; // Default to 0 if not available
              const retailPrice = product.wholesalePricing?.pricePerUnit || 0;
              const unitType = product.unitType || "N/A"; // Default to "N/A" if not specified

              // Multiply Retail Price by Units Per Case
              const totalRetailPrice =
                unitsPerCase > 0 ? (retailPrice * unitsPerCase).toFixed(2) : "N/A";

              return (
                <tr key={product.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{unitType}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₱{product.pricing?.pricePerUnit?.toFixed(2) || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">₱{parseFloat(priceCaseBundle).toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{unitsPerCase || "N/A"}</td>
                  <td className="border border-gray-300 px-4 py-2">₱{totalRetailPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintProductList;
