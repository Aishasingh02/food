const express = require("express");
const router = express.Router();
const Orders = require("../models/Orders");

router.post("/orderData", async (req, res) => {
  try {
    const { email, order_data, order_date } = req.body;

    // Add order date at the beginning
    let data = [...order_data];
    data.unshift({ Order_date: order_date });

    let existingOrder = await Orders.findOne({ email });

    if (existingOrder) {
      await Orders.findOneAndUpdate(
        { email },
        {
          $push: {
            order_data: { $each: data },
          },
        }
      );
    } else {
      await Orders.create({
        email: email,
        order_data: data,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;