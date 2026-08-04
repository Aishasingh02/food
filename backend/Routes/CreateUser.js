const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret="MynameisEndtoEndYouTubeChannel$#";

// CREATE USER
router.post(
  "/createuser",
  [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt=await bcrypt.genSalt(10);


    let secPassword=await bcrypt.hash(req.body.password,salt);

    try {

      await User.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPassword
      });

      res.json({ success: true });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
);

// LOGIN USER
router.post(
  "/loginuser",
  [
    body('email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 })
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.body.email;

    try {

      const userData = await User.findOne({ email });

      if (!userData) {
        return res.status(400).json({ errors: "Incorrect credentials" });
      }

      const pwdCompare=await bcrypt.compare(req.body.password,userData.password);
      if (!pwdCompare) {
        return res.status(400).json({ errors: "Incorrect credentials" });
      }

      const data={
        user:{
            id:userData.id
        }
      }

      const authToken=jwt.sign(data,jwtSecret);

      return res.json({ success: true,authToken:authToken });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false });
    }
  }
);

module.exports = router;