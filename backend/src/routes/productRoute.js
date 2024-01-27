const express = require("express");
const router = express.Router();

const deSerializeUser = require("../middleware/deserializeUser");
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

router.post("/newproduct", deSerializeUser, createProduct);
router.get("/products", deSerializeUser, getProducts);
router.put("/:id", deSerializeUser, updateProduct);
router.delete("/:id", deSerializeUser, deleteProduct);

module.exports = router;
