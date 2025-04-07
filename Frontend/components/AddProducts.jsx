import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/AddProducts.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddProduct = () => {
  const query = new URLSearchParams(useLocation().search);
  const brandId = query.get("brandId");
  const brandName = query.get("brandName");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    prize: "",
    link: "",
    type: "",
    rating: {},
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        brand_id: brandId,
        brandname: brandName,
        name: formData.name,
        code: formData.code,
        prize: parseFloat(formData.prize),
        link: formData.link,
        type: formData.type,
        rating: {},
      };
  
      const response = await axios.post(`${BASE_URL}/product/add`, payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("Product Added:", response.data);
      alert(response.data.message || "Product added successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error adding product:", error);
  
      const errorMessage = error.response?.data?.message || "Failed to add product.";
      alert(errorMessage);
    }
  };
  
  return (
    <div className="Add-prod">
      <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
       
      <div className="add-product-container">
       
      <form onSubmit={handleSubmit} className="product-form">
      <h2>Add Product for {brandName}</h2>
        <input type="text" name="name" placeholder="Product Name" className="inputbox" onChange={handleChange} required /><br/>
        <input type="text" name="code" placeholder="Product Code" className="inputbox" onChange={handleChange} required /><br/>
        <input type="number" name="prize" placeholder="Price" className="inputbox" onChange={handleChange} required /><br/>
        <input type="text" name="link" placeholder="Image Link"className="inputbox" onChange={handleChange} required /><br/>
        <input type="text" name="type" placeholder="Product Type" className="inputbox" onChange={handleChange} required /><br/>
        <button type="submit" className="prodbtn">Add Product</button>
        
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
