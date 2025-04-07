import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/ExportItem.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ExportItem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {};

  const [formData, setFormData] = useState({
    quantity: "",
    manufactureDate: "",
    expiryDate: "",
    location: "",
  });

  const [qrCode, setQrCode] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        code: product.code,
        name: product.name,
        category: product.type,
        price: product.prize,
        link:product.link,
      };
      console.log(payload);

      const response = await axios.post(`${BASE_URL}/ds/create-barcode`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response.data);
      if (response.data.status === "true") {
        setQrCode(response.data.qrCode);
        setErrorMessage(""); 
      } else {
        setErrorMessage(response.data.error || "Failed to generate QR code");
        setQrCode(""); 
      }
      
    } catch (error) {
      console.error("Error exporting product:", error.response.data.error);
      setErrorMessage(error.response.data.error);
      setQrCode(""); 
    }
  };

  const handleDownload = () => {
    if (qrCode) {
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = `${product.name}-barcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="export-item-page">
      <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
      <div className="division">
        {/* Product Details */}
        <div className="productdetail">
          <h3>Product Details</h3>
          <img src={product.link} alt={product.name} className="product-img" />
          <div>
            <h2>{product.name}</h2>
            <p><strong>Code:</strong> {product.code}</p>
            <p><strong>Price:</strong> ₹ {product.prize}</p>
            <p><strong>Type:</strong> {product.type}</p>
            <p><strong>Brand:</strong> {product.brandname}</p>
          </div>
        </div>

        <div className="Details-Entry">
          <h3>Enter QR code Details</h3>
          <form onSubmit={handleSubmit}>
            <label>Quantity:</label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />

            <label>Manufacture Date:</label>
            <input
              type="date"
              name="manufactureDate"
              value={formData.manufactureDate}
              onChange={handleChange}
              required
            />

            <label>Expiry Date:</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />

            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="Barcode">
          <h3>QR Code</h3>
          {qrCode ? (
            <>
              <img src={qrCode} alt="Generated QR Code" />
              <button onClick={handleDownload} className="download">Download</button>
            </>
          ) : (
            errorMessage && <p className="error">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportItem;
