const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const generateOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.newOrder = async (req, res) => {
  const {
    products,
    userId,
    firstName,
    lastName,
    email,
    contact,
    Country,
    StreetAddress,
    townCity,
    Postcode,
    paymentMethod,
  } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    let order = await Order.findOne({ userId: userId });

    if (!order) {
      order = new Order({
        products: products.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        userId: userId,
        firstName,
        lastName,
        email,
        contact,
        Country,
        StreetAddress,
        townCity,
        Postcode,
        paymentMethod,
        orderNo: generateOrderNumber(),
      });
    } else {
      if (products && products.length > 0) {
        for (const item of products) {
          const existingProductIndex = order.products.findIndex(
            (p) =>
              p.productId &&
              p.productId.toString() === item.productId.toString()
          );

          if (existingProductIndex > -1) {
            order.products[existingProductIndex].quantity += item.quantity;
          } else {
            order.products.push({
              productId: item.productId,
              quantity: item.quantity,
            });
          }
        }
      }

      order.firstName = firstName || order.firstName;
      order.lastName = lastName || order.lastName;
      order.email = email || order.email;
      order.contact = contact || order.contact;
      order.Country = Country || order.Country;
      order.StreetAddress = StreetAddress || order.StreetAddress;
      order.townCity = townCity || order.townCity;
      order.Postcode = Postcode || order.Postcode;
      order.paymentMethod = paymentMethod || order.paymentMethod;
    }

    let cartItems = 0;
    let cartTotal = 0;
    let totalItems = 0;

    for (const item of order.products) {
      if (item.productId) {
        const product = await Product.findById(item.productId);
        cartItems += 1;
        totalItems += item.quantity;
        cartTotal += product.price * item.quantity;
      }
    }

    const shippingCost = "5.00";
    order.cartItems = cartItems;
    order.cartTotal = cartTotal.toFixed(2);
    order.shippingCost = shippingCost;
    order.totalItems = totalItems;

    await order.save();

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { orders: order._id } },
      { new: true }
    );

    await order.populate({
      path: "products.productId",
      model: "Product",
    });

    res.status(200).json({
      message: "Order Created successfully.",
      orderId: order._id,
      orderNo: order.orderNo,
      orderDetails: order.products.map((item) => ({
        name: item.productId.productName,
        image: item.productId.thumbnail,
        availability: item.productId.isAvailable,
        price: item.productId.price,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
        attributes: {
          colour: item.productId.colorId,
          attributes: item.productId.attributesId,
        },
      })),
      shippingDetails: {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        contact: order.contact,
        Country: order.Country,
        StreetAddress: order.StreetAddress,
        townCity: order.townCity,
        Postcode: order.Postcode,
        paymentMethod: order.paymentMethod,
      },
      orderTotal: cartTotal.toFixed(2),
      cartItems,
      totalItems,
      shippingCost,
      orderDate: order.createdAt,
      userId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

// Function to get order details by orderId
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required." });
    }

    const order = await Order.findById(orderId).populate({
      path: "products.productId",
      model: "Product",
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const orderDetails = order.products.map((item) => ({
      name: item.productId.productName,
      image: item.productId.thumbnail,
      availability: item.productId.isAvailable,
      price: item.productId.price,
      quantity: item.quantity,
      total: (item.productId.price * item.quantity).toFixed(2),
      attributes: {
        colour: item.productId.colorId,
        attributes: item.productId.attributesId,
      },
    }));

    res.status(200).json({
      message: "Order fetched successfully.",
      orderId: order._id,
      orderNumber: order.orderNo,
      orderDetails: orderDetails,
      shippingDetails: {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        contact: order.contact,
        Country: order.Country,
        StreetAddress: order.StreetAddress,
        townCity: order.townCity,
        Postcode: order.Postcode,
        paymentMethod: order.paymentMethod,
      },
      orderTotal: order.cartTotal,
      cartItems: order.cartItems,
      totalItems: order.totalItems,
      shippingCost: order.shippingCost,
      orderDate: order.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

// Function to get all orders by userId
exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found." });
    }

    const orders = await Order.find({ userId: userId }).populate({
      path: "products.productId",
      model: "Product",
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    const ordersData = orders.map((order) => ({
      orderId: order._id,
      orderNo: order.orderNo,
      orderDetails: order.products.map((item) => ({
        name: item.productId.productName,
        image: item.productId.thumbnail,
        availability: item.productId.isAvailable,
        price: item.productId.price,
        quantity: item.quantity,
        total: (item.productId.price * item.quantity).toFixed(2),
        attributes: {
          colour: item.productId.colorId,
          attributes: item.productId.attributesId,
        },
      })),
      shippingDetails: {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        contact: order.contact,
        Country: order.Country,
        StreetAddress: order.StreetAddress,
        townCity: order.townCity,
        Postcode: order.Postcode,
        paymentMethod: order.paymentMethod,
      },
      orderTotal: order.cartTotal,
      cartItems: order.cartItems,
      totalItems: order.totalItems,
      shippingCost: order.shippingCost,
      orderDate: order.createdAt,
    }));

    res.status(200).json({
      message: "Orders fetched successfully.",
      orders: ordersData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};

// Update Shipping Address
exports.updateShippingAddress = async (req, res) => {
  // const { userId } = req.params;
  const userId = req.body;

  const {
    firstName,
    lastName,
    email,
    contact,
    Country,
    StreetAddress,
    townCity,
    Postcode,
    paymentMethod,
  } = req.body;

  try {
    // Find the cart for the user
    let cart = await Cart.findOne({ orderby: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Update shipping details
    cart.firstName = firstName || cart.firstName;
    cart.lastName = lastName || cart.lastName;
    cart.email = email || cart.email;
    cart.contact = contact || cart.contact;
    cart.Country = Country || cart.Country;
    cart.Afghanistan = Afghanistan || cart.Afghanistan;
    cart.StreetAddress = StreetAddress || cart.StreetAddress;
    cart.townCity = townCity || cart.townCity;
    cart.Postcode = Postcode || cart.Postcode;
    cart.paymentMethod = paymentMethod || cart.paymentMethod;

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      message: "Shipping address updated successfully.",
      shippingDetails: {
        firstName: cart.firstName,
        lastName: cart.lastName,
        email: cart.email,
        contact: cart.contact,
        Country: cart.Country,
        Afghanistan: cart.Afghanistan,
        StreetAddress: cart.StreetAddress,
        townCity: cart.townCity,
        Postcode: cart.Postcode,
        paymentMethod: cart.paymentMethod,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//get one
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ orderby: userId }).populate({
      path: "products.productId",
      model: "Product",
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Calculate the total price for all products in the cart
    const cartTotal = cart.products.reduce((total, item) => {
      if (item.productId) {
        const productTotal = item.productId.price * item.quantity;
        return total + productTotal;
      }
      return total;
    }, 0);

    res.status(200).json({
      cartId: cart._id,
      cartDetails: cart.products.map((item) => ({
        name: item.productId.productName,
        image: item.productId.thumbnail,
        availability: item.productId.isAvailable,
        price: item.productId.price,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
        attributes: {
          colour: item.productId.colorId,
          attributes: item.productId.attributesId,
        },
      })),
      cartTotal,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//// Update cart
exports.updateCart = async (req, res) => {
  const { userId } = req.params;
  const { products } = req.body;

  try {
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required." });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ orderby: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Update or add products
    for (const item of products) {
      const existingProductIndex = cart.products.findIndex(
        (p) =>
          p.productId && p.productId.toString() === item.productId.toString()
      );

      if (existingProductIndex > -1) {
        // Product already in the cart, update the quantity
        cart.products[existingProductIndex].quantity = item.quantity;
      } else {
        // Add new product to the cart
        cart.products.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    }

    // Save the cart
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully.",
      cartId: cart._id,
      cartDetails: cart.products.map((item) => ({
        name: item.productId.productName,
        image: item.productId.thumbnail,
        availability: item.productId.isAvailable,
        price: item.productId.price,
        quantity: item.quantity,
        total: item.productId.price * item.quantity,
        attributes: {
          colour: item.productId.colorId,
          attributes: item.productId.attributesId,
        },
      })),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete cart
exports.deleteCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find and delete the cart for the user
    const cart = await Cart.findOneAndDelete({ orderby: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Remove the cart ID from the user's carts array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { carts: cart._id } },
      { new: true }
    );

    res.status(200).json({ message: "Cart deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ orderby: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    // Clear all products from the cart
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully.", cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
