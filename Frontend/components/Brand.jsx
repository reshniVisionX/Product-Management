import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/Brand.css";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Brand = () => {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/brand/${brandId}`);
        setBrand(response.data);
      } catch (error) {
        console.error("Error fetching brand details:", error);
        setBrand(null);
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchBrandDetails();
    }
  }, [brandId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/product/${brandId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (brandId) {
      fetchProducts();
    }
  }, [brandId]);

  const handleAddProduct = () => {
    if (brand) {
      navigate(`/addproduct?brandId=${brandId}&brandName=${encodeURIComponent(brand.brand)}`);
    }
  };

  const handleProductClick = (product) => {
    navigate("/export-item", { state: { product } });
  };

  return (
    <div className="brand-page">
      {loading ? (
        <p>Loading...</p>
      ) : brand ? (
        <>
          <div className="brand-header">
            <img src={brand.link} alt={brand.brand} className="brand-pic" />
            <div className="brand-details">
              <h1 className="brand-names">{brand.brand}</h1>
              <p className="brand-category">Category: {brand.category}</p>
              <i>{new Date(brand.createdAt).toLocaleDateString()}</i>
            </div>
            <button className="return-btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="addprod-btn" onClick={handleAddProduct}>
              +
            </button>
          </div>

          <div className="product-list">
            <h2>Products</h2>
            {products.length > 0 ? (
              <div className="product-grid">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="product-item"
                    onClick={() => handleProductClick(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={product.link} alt={product.name} className="product-image" />
                    <h3>{product.name}</h3>
                    <p>Code: {product.code}</p>
                    <p>Price: ${product.prize}</p>
                    <p>Type: {product.type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No products available for this brand.</p>
            )}
          </div>
        </>
      ) : (
        <p>Brand not found</p>
      )}
    </div>
  );
};

export default Brand;
