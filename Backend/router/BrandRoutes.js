const express = require('express');
const router = express.Router();
const Brand = require('../model/Brand'); 
const mongoose = require('mongoose');

router.post('/addbrand', async (req, res) => {
  try {
    const { brand, link, category } = req.body;
    console.log(brand,link,category);
    if (!brand || !link || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBrand = new Brand({ brand, link, category });
    await newBrand.save();

    res.status(201).json({ message: "Brand added successfully", brand: newBrand });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding brand", error });
  }
});

router.get('/fetchAllbrands', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching brands", error });
  }
});

router.get("/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res.status(400).json({ message: "Invalid Brand ID format" });
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json(brand);
  } catch (error) {
    console.error("Error fetching brand details:", error);
    res.status(500).json({ message: "Error fetching brand details", error });
  }
});


module.exports = router;
