const express = require("express");
const router = express.Router();
const MyProduct = require("../model/Products");

router.post("/add", async (req, res) => {
  try {
    const { brand_id, brandname, name, code, prize, link, type } = req.body;
    console.log(brand_id, name, code);

    if (!brand_id || !brandname || !name || !code || !prize || !link || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProduct = await MyProduct.findOne({ code });
    if (existingProduct) {
      return res.status(400).json({ message: "Product code already exists" });
    }

    const newProduct = new MyProduct({
      brand_id,
      brandname,
      name,
      code,
      prize,
      link,
      type,
      rating: {},
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error });
  }
});


router.get("/:brandId", async (req, res) => {
    try {
      const { brandId } = req.params;
      const products = await MyProduct.find({ brand_id: brandId }); 
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  
module.exports = router;
