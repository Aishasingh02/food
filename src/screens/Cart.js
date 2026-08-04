import React from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div className="container m-auto mt-5 text-center">
        <h3>Your Cart is Empty!</h3>
      </div>
    );
  }

  const handleRemove = (index) => {
    dispatch({
      type: "REMOVE",
      index: index,
    });
  };

  const handleCheckOut = async () => {
    let userEmail = localStorage.getItem("userEmail");

    try {
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          order_data: data,
          order_date: new Date().toDateString(),
        }),
      });

      const json = await response.json();

      if (json.success) {
        dispatch({ type: "DROP" });
        alert("Order Placed Successfully!");
      } else {
        alert("Order Failed!");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error!");
    }
  };

  let totalPrice = data.reduce((total, item) => total + item.price, 0);

  return (
    <div className="container m-auto mt-4">

      <table className="table table-hover table-bordered align-middle">
        <thead className="table-success">
          <tr>
            <th>#</th>
            <th>Food Name</th>
            <th>Quantity</th>
            <th>Size</th>
            <th>Price</th>
            <th>Remove</th>
          </tr>
        </thead>

        <tbody>
          {data.map((food, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{food.name}</td>
              <td>{food.qty}</td>
              <td>{food.size}</td>
              <td>₹{food.price}/-</td>

              <td className="text-center">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemove(index)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div className="d-flex justify-content-between align-items-center">
        <h3>Total Price: ₹{totalPrice}/-</h3>

        <button
          className="btn btn-success btn-lg"
          onClick={handleCheckOut}
        >
          Check Out
        </button>
      </div>

    </div>
  );
}