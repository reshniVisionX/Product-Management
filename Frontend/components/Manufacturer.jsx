import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/Manufacturer.css';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Manufacturer = () => {
  const [brands, setBrands] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/brand/fetchAllbrands`)
      .then(response => {
        setBrands(response.data);
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
      });
  }, []);

  return (
    <div className="manufacturer-container">
     <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
      
      <button className="addbrand" onClick={() => navigate('/add-brand')}>
        +
      </button>

      <h1>Brands</h1>

      <div className="brand-grid">
        {brands.map((brand) => (
          <div 
            key={brand.brand} 
            className="brand-box"
            onClick={() => navigate(`/brand/${brand._id}`)}
          >
            <img src={brand.link} alt={brand.brand} className="brand-image" />
            <div className="brand-name">{brand.brand}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Manufacturer;
