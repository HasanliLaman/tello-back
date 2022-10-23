const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Product = require("../models/product");

exports.checkout = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * req.body.quantity * 100,
        },
        quantity: req.body.quantity,
      },
    ],

    payment_method_types: ["card"],
    mode: "payment",
    customer_creation: "always",
    customer_reference: product._id,
    customer_email: req.user.email,
    success_url: `http://localhost:3000/cart`,
    cancel_url: `http://localhost:3000/error`,
  });

  res.status(201).json({ success: true, session });
});
