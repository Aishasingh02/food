const express = require("express");
const router = express.Router();
const Orders = require("../models/Orders");

router.post("/myOrderData", async (req, res) => {
  try {
    const email = req.body.email;

    const myData = await Orders.findOne({ email });

    if (!myData) {
      return res.json({ success: true, orderData: [] });
    }

    res.json({
      success: true,
      orderData: myData.order_data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;