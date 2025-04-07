import React, { useState } from "react";
import axios from "axios";
import "../Css/Customer.css"
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Customer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [productData, setProductData] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(`${BASE_URL}/qr/process-image`, formData);
      if (response.data.status === "success") {
        verifyBarcode(response.data.qrData);
      } else {
        setError("Invalid QR code, fake product.");
        setProductData(null);
      }
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Try again.");
    }
  };

  const handleCameraScan = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/qr/scan-camera`);

      if (response.data.status === "success") {
        setProductData(response.data.productDetails);
        setError("");
      } else {
        setProductData(null);
        setError("Invalid QR code, fake product.");
      }
    } catch (err) {
      console.error("Error scanning QR:", err);
      setError("Failed to scan QR code from camera.");
    }
  };

  const verifyBarcode = async (qrData) => {
    try {
      const response = await axios.post(`${BASE_URL}/verify-barcode`, { base64EncodedData: qrData });

      if (response.data.status === "success") {
        setProductData(response.data.productDetails);
        setError("");
      } else {
        setProductData(null);
        setError("Invalid QR code, fake product.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Verification Failed. Try Again.");
      setProductData(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleString(); 
  };

  
  return (
    <div className="customer">
          <button onClick={() => navigate(-1)} className="backbtn">Go Back</button>
 
    <div className="product-container">
     
      <h2 className="title">Customer QR Code Scanner</h2>

      <div className="button-group">
        <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} className="button button-upload">Upload & Process</button>
        <button onClick={handleCameraScan} className="button button-scan">Open Camera & Scan</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {productData && (
        <div className="product-details">
          <h3 className="product-title">Product Details</h3>
          
          <img src={productData.link} alt={productData.name} className="product-image" />
          <table className="product-table">
          <tbody>
  {Object.entries(productData).map(([key, value]) => (
    key !== "link" && (
      <tr key={key}>
        <td className="table-header">{key.replace(/([A-Z])/g, " $1")}</td>
        <td className="table-data">
          {key.toLowerCase().includes("timestamp") ? formatTimestamp(value) : value}
        </td>
      </tr>
    )
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
         
    </div>
  );
};

export default Customer;
