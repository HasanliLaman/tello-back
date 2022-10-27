const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Product = require("../models/product");

exports.checkout = catchAsync(async (req, res, next) => {
  const cartInfo = [];

  for (const el of req.body.cart) {
    const product = await Product.findById(el.product);
    cartInfo.push({ product, quantity: el.quantity });
  }

  const items = cartInfo.map((el) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: el.product.name,
        },
        unit_amount: el.product.price * 100,
      },
      quantity: el.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    payment_method_types: ["card"],
    mode: "payment",
    customer_creation: "always",
    customer_email: req.user.email,
    success_url: `http://localhost:3000/cart`,
    cancel_url: `http://localhost:3000/error`,
  });

  res.status(201).json({ success: true, session });
});

exports.webhook = catchAsync((req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;

  event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

  switch (event.type) {
    case "payment_intent.succeeded": {
      console.log(`PaymentIntent was successful!`);
      break;
    }
    default:
      return res.status(400).end();
  }
  res.json({ received: true });
});
