const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/productController");

const upload = require("../config/multer");

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/search", searchProducts);

module.exports = router;
