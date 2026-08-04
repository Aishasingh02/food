import React, { useState, useEffect, useRef } from "react";
import { useCart, useDispatchCart } from "../components/ContextReducer";

export default function Cards(props) {
    let dispatch = useDispatchCart();
    let data = useCart();
    let options = props.options;
    let priceOptions = Object.keys(options);

    const priceRef = useRef();

    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");

    useEffect(() => {
        setSize(priceRef.current.value);
    }, []);

    let finalPrice = qty * parseInt(options[size]);

    const handleToCart = async () => {
        await dispatch({
            type: "ADD",
            id: props.foodItem._id,
            name: props.foodItem.name,
            price: finalPrice,
            qty: qty,
            size: size,
        });

        console.log(data);
    };

    return (
        <div>
            <div
                className="card mt-3"
                style={{ width: "18rem", maxHeight: "360px" }}
            >
                <img
                    src={props.foodItem.img}
                    className="card-img-top"
                    alt={props.foodItem.name}
                    style={{ height: "120px", objectFit: "fill" }}
                />

                <div className="card-body">
                    <h5 className="card-title">{props.foodItem.name}</h5>

                    <div className="container w-100">

                        <select
                            className="m-2 h-100 bg-success rounded"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                        >
                            {Array.from(Array(6), (e, i) => {
                                return (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                );
                            })}
                        </select>

                        <select
                            ref={priceRef}
                            className="m-2 h-100 bg-success rounded"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        >
                            {priceOptions.map((data) => {
                                return (
                                    <option key={data} value={data}>
                                        {data}
                                    </option>
                                );
                            })}
                        </select>

                        <div className="d-inline h-100 fs-5">
                            ₹{finalPrice}/-
                        </div>

                        <hr />

                        <button
                            className="btn btn-success w-100"
                            onClick={handleToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}