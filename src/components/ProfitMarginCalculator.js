import React, { useState } from "react";
import ProfitCalculator from "./ProfitCalculator";

const ProfitMarginCalculator = () => {
  const [retailPrice, setRetailPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState({
    totalRetailPrice: "0.00",
    totalSellingPrice: "0.00",
    totalSelling: "0.00",
    totalProfit: "0.00",
    profitMarginRetail: "0.00",
  });

  const calculateProfitMargin = () => {
    const totalRetailPrice = parseFloat(retailPrice || 0) * parseInt(quantity || 1, 10);
    const totalSellingPrice = parseFloat(sellingPrice || 0) * parseInt(quantity || 1, 10);
    const totalSelling = totalSellingPrice; // Total Selling Price
    const totalProfit = totalSellingPrice - totalRetailPrice;

    // Calculate Profit Margin (Retail Price)
    let profitMarginRetail = 0;
    if (totalRetailPrice > 0) {
      profitMarginRetail = (totalProfit / totalRetailPrice) * 100;
    }

    setResults({
      totalRetailPrice: totalRetailPrice.toFixed(2),
      totalSellingPrice: totalSellingPrice.toFixed(2),
      totalSelling: totalSelling.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      profitMarginRetail: profitMarginRetail.toFixed(2),
    });
  };

  // Get dynamic text color based on profit margin
  const getTextColor = (margin) => {
    const value = parseFloat(margin);
    if (value < 3) return "red";
    if (value < 5) return "orange";
    if (value < 7) return "orange";
    return "green";
  };

  return (
    <div
    
     className="flex  p-4 w- bg-gray-200 space-x-4 justify-center">
     <div className="bg-white p-4 rounded-md">
     <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "20px" }}>
        Profit Margin Calculator
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>Retail Price:</label>
          <input
            type="number"
            value={retailPrice}
            onChange={(e) => setRetailPrice(e.target.value)}
            style={{
              padding: "10px",
              marginRight: "20px",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter retail price"
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>Selling Price:</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            style={{
              padding: "10px",
              marginRight: "20px",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter selling price"
          />
        </div>
        <div>
          <label style={{ fontWeight: "bold", marginRight: "10px" }}>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            placeholder="Enter quantity"
          />
        </div>
      </div>
      <button
        onClick={calculateProfitMargin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        Calculate
      </button>
      <div
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p>Total Retail Price: ₱{results.totalRetailPrice}</p>
        <p>Total Selling Price: ₱{results.totalSellingPrice}</p>
        <p>Total Selling: ₱{results.totalSelling}</p>
        <p>
          Total Profit:{" "}
          <span
            style={{
              fontWeight: "bold",
              color: getTextColor(results.profitMarginRetail),
            }}
          >
            ₱{results.totalProfit}
          </span>
        </p>
        <p>
          Profit Margin (Retail Price):{" "}
          <span
            style={{
              fontWeight: "bold",
              color: getTextColor(results.profitMarginRetail),
            }}
          >
            {results.profitMarginRetail}%
          </span>
        </p>
      </div>
     </div>
     <ProfitCalculator/>
    </div>
  );
};

export default ProfitMarginCalculator;
