const Product = require("../models/productModel");
const slugify = require("slugify");

//Create
exports.createProduct = async (req, res) => {
  console.log("Files:", req.files);
  console.log("Body:", req.body);

  try {
    // Checking if files are present
    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({ message: "Thumbnail is required." });
    }

    const {
      productName,
      price,
      sku,
      description,
      isAvailable,
      isNew,
      isLike,
      colorId,
      attributesId,
      categoryId,
    } = req.body;

    // Ensure productName exists and is a string
    if (!productName || typeof productName !== "string") {
      return res
        .status(400)
        .json({ message: "Product name is required and must be a string." });
    }

    const slug = slugify(productName, { lower: true });

    // Check if the product already exists by productName
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already added." });
    }

    const normalisedIsAvailable =
      isAvailable.trim().toLowerCase() === "yes" ? "Yes" : "No";
    const normalisedIsNew = isNew.trim().toLowerCase() === "yes" ? "Yes" : "No";

    const thumbnail = req.files.thumbnail
      ? req.files.thumbnail[0].filename
      : "";
    const images = req.files.images
      ? req.files.images.map((file) => file.filename)
      : [];

    // Ensure price is a number
    const cleanedPrice = parseFloat(price);

    const product = new Product({
      productName,
      slug,
      price: cleanedPrice,
      sku,
      description,
      isAvailable: normalisedIsAvailable,
      isNew: normalisedIsNew,
      isLike,
      colorId,
      attributesId,
      categoryId,
      thumbnail,
      images,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get all
exports.getAllProducts = async (req, res) => {
  try {
    const {
      search = "",
      categoryId = "",
      attributesId = "",
      colorId = "",
      minPrice = 1,
      maxPrice = 250,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const formattedSearchTerm = search.trim().toLowerCase().replace(/\s+/g, "");

    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Convert minPrice and maxPrice to numbers
    const minPriceNumber = parseFloat(minPrice) || 1;
    const maxPriceNumber = parseFloat(maxPrice) || 250;

    // Prepare the query
    const query = {
      price: { $gte: minPriceNumber, $lte: maxPriceNumber }, // Filter by price range
    };

    if (formattedSearchTerm) {
      query.productName = { $regex: formattedSearchTerm, $options: "i" };
    }

    if (categoryId) query.categoryId = categoryId;
    if (attributesId) query.attributesId = attributesId;
    if (colorId) query.colorId = colorId;

    // Date range filter for createdAt and updatedAt
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.createdAt = { $gte: start, $lte: end };
      query.updatedAt = { $gte: start, $lte: end };
    }
    // Find products with filtering and pagination
    const products = await Product.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate("colorId", "colorName")
      .populate("attributesId", "attributeName")
      .populate("categoryId", "categoryName")
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "userName" },
      })
      .populate("isLike", "userName");

    // Count matching products
    const totalCount = await Product.countDocuments(query);

    // Return paginated results
    res.status(200).json({
      totalCount,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("colorId", "colorName")
      .populate("attributesId", "attributeName")
      .populate("categoryId", "categoryName")
      .populate({
        path: "reviews",
        populate: { path: "userId", select: "userName" },
      })
      .populate("isLike", "userName");

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update
exports.updateProduct = async (req, res) => {
  try {
    if (req.body.productName) {
      req.body.slug = slugify(req.body.productName);
    }

    const {
      productName,
      price,
      isNew,
      isLike,
      colorId,
      attributesId,
    } = req.body;

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    existingProduct.productName = productName
      ? productName.trim()
      : existingProduct.productName;
    existingProduct.price = price || existingProduct.price;
    existingProduct.isNew =
      typeof isNew !== "undefined" ? isNew : existingProduct.isNew;
    existingProduct.isLike = isLike || existingProduct.isLike;
    existingProduct.colorId = colorId || existingProduct.colorId;
    existingProduct.attributesId = attributesId || existingProduct.attributesId;

    await existingProduct.save();
    res.status(200).json(existingProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully.", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products by name with pagination
exports.searchProducts = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const formattedSearchTerm = search.trim().toLowerCase();

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    const products = await Product.find({
      productName: { $regex: formattedSearchTerm, $options: "i" },
    })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Product.countDocuments({
      productName: { $regex: formattedSearchTerm, $options: "i" },
    });

    res.status(200).json({
      totalCount,
      page: pageNumber,
      pageSize: pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
