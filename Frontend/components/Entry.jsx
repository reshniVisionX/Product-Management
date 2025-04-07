import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/login.css';

const Entry = () => {
  const navigate = useNavigate();

  return (
    <div className="entry-container">
    
      <div className="tabs">
        <div onClick={() => navigate('/manufacturer')} className="tab">
          <img src="https://media.gettyimages.com/id/1470494000/photo/food-processing-plant-warehouse-operated-by-careful-workers-with-jars.jpg?s=612x612&w=gi&k=20&c=_YWzhYw-VhjUCkTa1AtOTX8jhICZtYCkATuPGo59okM=" alt="Manufacturer" className="tab-image" />
          <p>Manufacturer</p>
        </div>
        <div onClick={() => navigate('/customer')} className="tab">
          <img src="https://i0.wp.com/www.luxtag.io/wp-content/uploads/2021/01/3-easy-ways-to-attract-customers-to-scan-your-qr-codes.jpg?fit=2560%2C1847&ssl=1" alt="Customer" className="tab-image" />
          <p>Customer</p>
        </div>
      </div>
    </div>
  );
};

export default Entry;
