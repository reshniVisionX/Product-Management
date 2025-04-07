import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Entry from '../components/Entry';
import Manufacturer from '../components/Manufacturer';
import Customer from '../components/Customer';
import AddProducts from '../components/AddProducts';
import AddBrands from '../components/AddBrands';
import Brand from "../components/Brand"; 
import ExportItem from '../components/ExportItem';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/manufacturer" element={<Manufacturer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/addproduct" element={<AddProducts />} /> 
        <Route path="/add-brand" element={<AddBrands />} />
        <Route path="/brand/:brandId" element={<Brand />} />
        <Route path="/export-item" element={<ExportItem />} /> 
      </Routes>
    </Router>
  );
}

export default App;
