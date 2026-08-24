import React, { useEffect, useState } from "react";
import { useCart, useDispatchCart } from "./ContextReducer";

export default function Cards(props) {
  const dispatch = useDispatchCart();
  const cartData = useCart();

  const [priceOptions, setPriceOptions] = useState(
    Object.keys(props.options || {})
  );

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState(priceOptions[0] || "");
  const [isFavorite, setIsFavorite] = useState(false);

  const foodItem = props.foodItem || {};

  useEffect(() => {
    if (props.options) {
      const keys = Object.keys(props.options);
      setPriceOptions(keys);
      if (!size && keys.length > 0) {
        setSize(keys[0]);
      }
    }
  }, [props.options]);

  // ---------------- CHECK FAVORITE ----------------
  useEffect(() => {
    let isMounted = true;

    const checkFavorite = async () => {
      const authToken = localStorage.getItem("authToken");
      const userEmail = localStorage.getItem("userEmail");

      if (!authToken && !userEmail) {
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/getfavorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken || ""
          },
          body: JSON.stringify({
            email: userEmail
          })
        });

        const json = await response.json();

        if (isMounted && json.success) {
          const currentId = foodItem._id ? foodItem._id.toString() : "";
          const foundInIds = json.favoriteIds && json.favoriteIds.includes(currentId);
          const foundInItems = json.favorites && json.favorites.some(
            (item) => (item._id ? item._id.toString() : item.toString()) === currentId
          );

          setIsFavorite(Boolean(foundInIds || foundInItems));
        }
      } catch (error) {
        console.log("Favorite check error:", error);
      }
    };

    if (foodItem._id) {
      checkFavorite();
    }

    return () => {
      isMounted = false;
    };
  }, [foodItem._id]);

  // ---------------- ADD / REMOVE FAVORITE ----------------
  const toggleFavorite = async () => {
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    if (!authToken && !userEmail) {
      alert("Please login first to save favourites!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/togglefavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authToken || ""
        },
        body: JSON.stringify({
          foodId: foodItem._id,
          email: userEmail
        })
      });

      const json = await response.json();

      if (json.success) {
        setIsFavorite(json.isFavorite);
        if (props.onFavoriteToggle) {
          props.onFavoriteToggle(foodItem._id, json.isFavorite);
        }
      } else {
        alert(json.message || "Failed to update favourite");
      }
    } catch (error) {
      console.log("Favorite error:", error);
    }
  };

  // ---------------- ADD TO CART ----------------
  const handleAddToCart = async () => {
    if (!localStorage.getItem("authToken")) {
      alert("Please login to add items to cart!");
      return;
    }

    await dispatch({
      type: "ADD",
      id: foodItem._id,
      name: foodItem.name,
      price: finalPrice * qty,
      qty: qty,
      size: size,
      img: foodItem.img
    });
  };

  let finalPrice =
    props.options && props.options[size]
      ? parseInt(props.options[size])
      : 0;

  return (
    <div className="card mt-3 shadow-sm h-100">
      <div style={{ position: "relative" }}>
        <img
          src={foodItem.img}
          className="card-img-top"
          alt={foodItem.name}
          style={{
            height: "180px",
            objectFit: "cover"
          }}
        />

        {/* FAVORITE BUTTON */}
        <button
          onClick={toggleFavorite}
          title={isFavorite ? "Remove from favourites" : "Add to favourites"}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: "none",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "transform 0.15s ease"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-body d-flex flex-column justify-content-between">
        <div>
          <h5 className="card-title text-success fw-bold">{foodItem.name}</h5>
          <p className="card-text text-muted small" style={{ minHeight: "40px" }}>
            {foodItem.description}
          </p>
        </div>

        <div>
          {/* QUANTITY & SIZE */}
          <div className="container w-100 p-0 mb-2 d-flex align-items-center justify-content-between flex-wrap">
            <div className="d-flex align-items-center">
              <select
                className="m-1 bg-success text-white rounded p-1 border-0"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
              >
                {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>

              <select
                className="m-1 bg-success text-white rounded p-1 border-0"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                {priceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-inline fs-5 fw-bold text-dark">
              ₹{finalPrice * qty}/-
            </div>
          </div>

          <hr className="my-2" />

          {/* ADD TO CART */}
          <button
            className="btn btn-success w-100 fw-semibold"
            onClick={handleAddToCart}
          >
            Add to Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );
}