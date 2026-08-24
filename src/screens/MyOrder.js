import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/myOrderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("userEmail"),
        }),
      });

      const json = await response.json();

      if (json.success) {
        setOrderData(json.orderData || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  let orders = [];
  let currentOrder = [];

  orderData.forEach((item) => {
    if (item.Order_date) {
      if (currentOrder.length > 0) {
        orders.push(currentOrder);
      }
      currentOrder = [item];
    } else {
      currentOrder.push(item);
    }
  });

  if (currentOrder.length > 0) {
    orders.push(currentOrder);
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>

      <div className="container mt-4 mb-5" style={{ minHeight: "75vh" }}>
        <h2 className="text-center mb-4 fw-bold text-success">
          <i className="bi bi-clock-history me-2"></i>My Orders
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading your order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 shadow-sm rounded bg-light">
            <i className="bi bi-bag-x text-muted" style={{ fontSize: "3rem" }}></i>
            <h4 className="mt-3 text-secondary">No Orders Found</h4>
            <p className="text-muted">You haven't placed any food orders yet.</p>
          </div>
        ) : (
          orders.map((order, index) => {
            const headerInfo = order[0] || {};
            const items = order.filter((item) => !item.Order_date);
            const total = items.reduce((sum, item) => sum + item.price, 0);

            return (
              <div className="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden" key={index}>
                <div className="card-header bg-success text-white py-3 d-flex flex-wrap justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-semibold">
                      <i className="bi bi-calendar3 me-2"></i>
                      Order Date: {headerInfo.Order_date}
                    </h5>
                    {headerInfo.payment_id && (
                      <small className="d-block mt-1 text-light opacity-85">
                        <i className="bi bi-receipt me-1"></i>
                        Payment ID: <code>{headerInfo.payment_id}</code>
                      </small>
                    )}
                  </div>

                  <div className="mt-2 mt-sm-0">
                    {headerInfo.payment_status === "Paid" ? (
                      <span className="badge bg-light text-success fw-bold px-3 py-2">
                        <i className="bi bi-check-circle-fill me-1"></i> Paid via {headerInfo.payment_method || "Razorpay"}
                      </span>
                    ) : (
                      <span className="badge bg-light text-dark fw-semibold px-3 py-2">
                        Order Placed
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-body p-4">
                  {items.map((item, i) => (
                    <div
                      className={`row align-items-center py-3 ${
                        i !== items.length - 1 ? "border-bottom" : ""
                      }`}
                      key={i}
                    >
                      <div className="col-4 col-sm-3 col-md-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="img-fluid rounded shadow-sm"
                          style={{
                            height: "80px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                          }}
                        />
                      </div>

                      <div className="col-8 col-sm-6 col-md-7">
                        <h5 className="fw-semibold mb-1">{item.name}</h5>
                        <div className="text-muted small">
                          <span className="me-3">
                            <strong>Quantity:</strong> {item.qty}
                          </span>
                          <span>
                            <strong>Size:</strong> <span className="badge bg-secondary">{item.size}</span>
                          </span>
                        </div>
                      </div>

                      <div className="col-12 col-sm-3 col-md-3 text-sm-end mt-2 mt-sm-0">
                        <h5 className="text-success fw-bold mb-0">₹{item.price}/-</h5>
                      </div>
                    </div>
                  ))}

                  <div className="d-flex justify-content-between align-items-center pt-3 mt-2 border-top">
                    <span className="text-muted">Total Amount</span>
                    <h4 className="fw-bold text-success mb-0">₹{total}/-</h4>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}