import React, { useState } from "react";

const ProfitCalculator = () => {
  const [dailyRevenue, setDailyRevenue] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [results, setResults] = useState({
    totalRevenue: "0.00",
    totalProfit: "0.00",
  });

  const calculateProfit = () => {
    const revenue = parseFloat(dailyRevenue || 0) * parseInt(numberOfDays || 1, 10);
    const margin = parseFloat(profitMargin || 0) / 100;
    const profit = revenue * margin;

    setResults({
      totalRevenue: revenue.toFixed(2),
      totalProfit: profit.toFixed(2),
    });
  };

  return (
    <div className="bg-white p-4 rounded-md">
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        Profit Calculator
      </h2>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Daily Revenue:
        </label>
        <input
          type="number"
          value={dailyRevenue}
          onChange={(e) => setDailyRevenue(e.target.value)}
          placeholder="Enter daily revenue"
          style={{
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        />
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
         Average Profit Margin %:
        </label>
        <input
          type="number"
          value={profitMargin}
          onChange={(e) => setProfitMargin(e.target.value)}
          placeholder="Enter profit margin"
          style={{
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        />
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
          Number of Days:
        </label>
        <input
          type="number"
          value={numberOfDays}
          onChange={(e) => setNumberOfDays(e.target.value)}
          placeholder="Enter number of days"
          style={{
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>
      <button
        onClick={calculateProfit}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        Calculate
      </button>
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Total Revenue:</strong> ₱
          {parseFloat(results.totalRevenue).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Profit Margin:</strong> {profitMargin || 0}%
        </p>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Number of Days:</strong> {numberOfDays || 1}
        </p>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          <strong>Total Profit:</strong>{" "}
          <span
            style={{
              fontWeight: "bold",
              color:
                parseFloat(results.totalProfit) < 10000
                  ? "red"
                  : parseFloat(results.totalProfit) < 50000
                  ? "orange"
                  : "green",
            }}
          >
            ₱
            {parseFloat(results.totalProfit).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfitCalculator;
