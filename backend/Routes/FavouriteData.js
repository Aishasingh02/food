const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = "MynameisEndtoEndYouTubeChannel$#";

// Helper function to identify user from Token, Email, or UserId
const getUser = async (req) => {
    // 1. Check Authorization header for JWT token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader) {
        let token = authHeader;
        if (token.startsWith("Bearer ")) {
            token = token.slice(7).trim();
        }
        try {
            const decoded = jwt.verify(token, jwtSecret);
            if (decoded && decoded.user && decoded.user.id) {
                const user = await User.findById(decoded.user.id);
                if (user) return user;
            }
        } catch (e) {
            // Token verification failed or invalid, fall through
        }
    }

    // 2. Check email in body or custom header
    const email = req.body.email || req.headers["user-email"];
    if (email) {
        try {
            const user = await User.findOne({ email });
            if (user) return user;
        } catch (e) {}
    }

    // 3. Check userId in body
    const userId = req.body.userId;
    if (userId) {
        try {
            const user = await User.findById(userId);
            if (user) return user;
        } catch (e) {}
    }

    return null;
};

// Helper function to get all food items
const getAllFoodItems = async () => {
    if (global.food_items && global.food_items.length > 0) {
        return global.food_items;
    }
    try {
        const fetched_data = mongoose.connection.db.collection("food_items");
        const items = await fetched_data.find({}).toArray();
        global.food_items = items;
        return items;
    } catch (e) {
        console.error("Error fetching food items:", e);
        return [];
    }
};


// GET FAVORITES
router.post("/getfavorites", async (req, res) => {
    try {
        const user = await getUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or unauthorized. Please log in."
            });
        }

        const favIds = (user.favorites || []).map((id) => id.toString());
        const allFood = await getAllFoodItems();

        const favoriteItems = allFood.filter((item) =>
            favIds.includes(item._id ? item._id.toString() : "")
        );

        return res.json({
            success: true,
            favorites: favoriteItems,
            favoriteIds: favIds
        });
    } catch (error) {
        console.error("Get favorites error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


// ADD / REMOVE FAVORITE (TOGGLE)
router.post("/togglefavorite", async (req, res) => {
    try {
        const user = await getUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or unauthorized. Please log in."
            });
        }

        const { foodId } = req.body;
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "foodId is required"
            });
        }

        if (!user.favorites) {
            user.favorites = [];
        }

        const targetId = foodId.toString();
        const index = user.favorites.findIndex(
            (id) => (id ? id.toString() : "") === targetId
        );

        let isFavorite = false;
        if (index === -1) {
            user.favorites.push(targetId);
            isFavorite = true;
        } else {
            user.favorites.splice(index, 1);
            isFavorite = false;
        }

        await user.save();

        return res.json({
            success: true,
            isFavorite: isFavorite,
            favoriteIds: user.favorites
        });
    } catch (error) {
        console.error("Toggle favorite error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


// ADD FAVORITE
router.post("/addfavorite", async (req, res) => {
    try {
        const user = await getUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or unauthorized. Please log in."
            });
        }

        const { foodId } = req.body;
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "foodId is required"
            });
        }

        if (!user.favorites) {
            user.favorites = [];
        }

        const targetId = foodId.toString();
        if (!user.favorites.some((id) => (id ? id.toString() : "") === targetId)) {
            user.favorites.push(targetId);
            await user.save();
        }

        return res.json({
            success: true,
            message: "Added to favorites",
            favoriteIds: user.favorites
        });
    } catch (error) {
        console.error("Add favorite error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});


// REMOVE FAVORITE
router.post("/removefavorite", async (req, res) => {
    try {
        const user = await getUser(req);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found or unauthorized. Please log in."
            });
        }

        const { foodId } = req.body;
        if (!foodId) {
            return res.status(400).json({
                success: false,
                message: "foodId is required"
            });
        }

        if (!user.favorites) {
            user.favorites = [];
        }

        const targetId = foodId.toString();
        user.favorites = user.favorites.filter(
            (id) => (id ? id.toString() : "") !== targetId
        );

        await user.save();

        return res.json({
            success: true,
            message: "Removed from favorites",
            favoriteIds: user.favorites
        });
    } catch (error) {
        console.error("Remove favorite error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

module.exports = router;