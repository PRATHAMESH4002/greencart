import Product from "../models/product.js";
import Order from "../models/order.js";
import stripe from "stripe";
import User from "../models/User.js";
import generateInvoice from "../utils/generateInvoice.js";
import sendInvoiceMail from "../utils/sendInvoiceMail.js";

// ======================
// PLACE ORDER - COD
// ======================
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);

    // ✅ Create order
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    // ✅Populate user + product details
    await order.populate([
  { path: "userId" },
  { path: "items.product" }
]);


    // ✅ Generate invoice
    const invoicePath = generateInvoice(order);

    // ✅ Send mail
    await sendInvoiceMail(order.userId.email, invoicePath);

    res.json({
      success: true,
      message: "Order placed & invoice sent to email",
    });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// ======================
// PLACE ORDER - STRIPE
// ======================
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const { origin } = req.headers;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid Data" });
    }

    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price * 1.02) * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// ======================
// STRIPE WEBHOOK
// ======================
export const stripeWebhooks = async (req, res) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    try {
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: event.data.object.id,
      });

      const { orderId, userId } = session.data[0].metadata;

      // ✅ IMPORTANT FIX: Populate user + product
      const order = await Order.findByIdAndUpdate(
        orderId,
        { isPaid: true },
        { new: true }
      )
        .populate("userId")
        .populate("items.product");

      // ✅ Generate invoice
      const invoicePath = generateInvoice(order);

      // ✅ Send mail
      await sendInvoiceMail(order.userId.email, invoicePath);

      await User.findByIdAndUpdate(userId, { cartItems: {} });
    } catch (err) {
      console.log(err.message);
    }
  }

  res.json({ received: true });
};

// ======================
// GET USER ORDERS
// ======================
export const getUserOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// ======================
// GET ALL ORDERS (SELLER)
// ======================
export const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
