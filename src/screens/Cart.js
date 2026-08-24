import React, { useState } from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";

// Helper function to dynamically load Razorpay checkout script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const existingScript = document.getElementById("razorpay-checkout-js");
    if (existingScript) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();
  const [loading, setLoading] = useState(false);

  if (data.length === 0) {
    return (
      <div className="container m-auto mt-5 text-center">
        <div className="py-4">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: "3rem" }}></i>
          <h3 className="mt-3 text-secondary">Your Cart is Empty!</h3>
          <p className="text-muted">Add some delicious items from the menu to proceed.</p>
        </div>
      </div>
    );
  }

  const handleRemove = (index) => {
    dispatch({
      type: "REMOVE",
      index: index,
    });
  };

  const handleRazorpayPayment = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please login first to proceed with payment!");
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Calculate total amount
      const totalPrice = data.reduce((total, item) => total + item.price, 0);

      // 2. Fetch Razorpay public key
      const keyResponse = await fetch("http://localhost:5000/api/payment/getkey");
      const keyData = await keyResponse.json();

      if (!keyData.isConfigured) {
        alert(
          "⚠️ Razorpay API keys are not set in .env!\n\n" +
          "1. Open mernapp/backend/.env\n" +
          "2. Add your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET\n" +
          "3. Restart the backend server\n\n" +
          "Get free test keys at: https://dashboard.razorpay.com/app/keys"
        );
        setLoading(false);
        return;
      }

      if (!keyData.success || !keyData.key) {
        alert("Failed to retrieve Razorpay Key from server.");
        setLoading(false);
        return;
      }

      // 3. Create Razorpay order on backend
      const orderResponse = await fetch("http://localhost:5000/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success || !orderResult.order) {
        alert(orderResult.message || "Failed to initiate payment order.");
        setLoading(false);
        return;
      }

      // 4. Configure Razorpay checkout options
      const options = {
        key: keyData.key,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency || "INR",
        name: "GoFood",
        description: `Payment for ${data.length} item(s)`,
        image: "https://cdn-icons-png.flaticon.com/512/3081/3081840.png",
        order_id: orderResult.order.id,
        handler: async function (response) {
          try {
            // 5. Verify payment signature on backend
            const verifyResponse = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: userEmail,
                order_data: data,
                order_date: new Date().toDateString(),
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              dispatch({ type: "DROP" });
              alert(`🎉 Payment Successful!\nPayment ID: ${response.razorpay_payment_id}\nYour order has been placed!`);
            } else {
              alert(`❌ Payment Verification Failed: ${verifyResult.message}`);
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            alert("Error verifying payment on server.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: userEmail,
          contact: "",
        },
        theme: {
          color: "#198754", // GoFood green theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        alert(`❌ Payment Failed: ${response.error.description || response.error.reason}`);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Razorpay checkout error:", error);
      alert("Failed to initialize Razorpay checkout. Please try again.");
      setLoading(false);
    }
  };

  let totalPrice = data.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container m-auto mt-4">
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-success">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Food Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Size</th>
              <th scope="col">Price</th>
              <th scope="col" className="text-center">Remove</th>
            </tr>
          </thead>

          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td className="fw-semibold">{food.name}</td>
                <td>{food.qty}</td>
                <td>
                  <span className="badge bg-secondary">{food.size}</span>
                </td>
                <td className="fw-bold">₹{food.price}/-</td>

                <td className="text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(index)}
                    title="Remove item"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <span className="text-muted fs-6">Grand Total:</span>
          <h3 className="text-success fw-bold mb-0">₹{totalPrice}/-</h3>
        </div>

        <button
          className="btn btn-success btn-lg px-4 d-flex align-items-center gap-2 shadow-sm"
          onClick={handleRazorpayPayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              <i className="bi bi-shield-check"></i> Pay with Razorpay (₹{totalPrice})
            </>
          )}
        </button>
      </div>
    </div>
  );
}