import React, { useState } from 'react';
import axios from 'axios';
import '../Css/AddBrands.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;


const AddBrands = () => {
  const [formData, setFormData] = useState({
    brand: '',
    link: '',
    category: ''
  });
    const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("formData: ",formData);
      const response = await axios.post(`${BASE_URL}/brand/addbrand`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Response:', response.data);
      alert('Brand added successfully');
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Failed to add brand');
    }
  };

  return (
    <div className="add-brands-container">
      <div className="form-container">
      <button onClick={() => navigate(-1)} className="backbtn">Go Back</button>
        <h1>Create a Brand</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Brand Name:</label>
            <input 
              type="text" className="entrybox"
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Brand Link:</label>
            <input 
              type="url" 
              name="link" className="entrybox"
              value={formData.link} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Category:</label>
            <input 
              type="text" 
              name="category" className="entrybox"
              value={formData.category} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddBrands;
