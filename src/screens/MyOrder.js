import React, { useEffect, useState } from "react";

export default function MyOrder() {
  const [orderData, setOrderData] = useState([]);

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
        setOrderData(json.orderData);
      }

    } catch (error) {
      console.log(error);
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

      currentOrder = [
        {
          Order_date: item.Order_date
        }
      ];

    } 
    else {
      currentOrder.push(item);
    }

  });


  if (currentOrder.length > 0) {
    orders.push(currentOrder);
  }


  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        My Orders
      </h2>


      {
        orders.length === 0 ? (

          <h4 className="text-center">
            No Orders Found
          </h4>

        ) : (

          orders.map((order,index)=>{

            let total = order
              .filter(item=>!item.Order_date)
              .reduce((sum,item)=>sum+item.price,0);


            return (

              <div 
                className="card shadow mb-4"
                key={index}
              >

                <div className="card-header bg-success text-white">

                  <h5>
                    Order Date: {order[0].Order_date}
                  </h5>

                </div>


                <div className="card-body">


                {
                  order
                  .filter(item=>!item.Order_date)
                  .map((item,i)=>(

                    <div 
                      className="row align-items-center border-bottom py-3"
                      key={i}
                    >

                      <div className="col-md-3">

                        <img
                          src={item.img}
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{
                            height:"100px",
                            width:"120px",
                            objectFit:"cover"
                          }}
                        />

                      </div>


                      <div className="col-md-6">

                        <h5>
                          {item.name}
                        </h5>

                        <p className="mb-1">
                          Quantity: {item.qty}
                        </p>

                        <p className="mb-1">
                          Size: {item.size}
                        </p>

                      </div>


                      <div className="col-md-3">

                        <h5>
                          ₹{item.price}
                        </h5>

                      </div>


                    </div>

                  ))
                }


                <div className="text-end mt-3">

                  <h4>
                    Total: ₹{total}
                  </h4>

                </div>


                </div>

              </div>

            )

          })

        )
      }


    </div>
  );
}