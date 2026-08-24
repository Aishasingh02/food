import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import Cart from "../screens/Cart";
import { useCart } from "./ContextReducer";

export default function Navbar() {

  const navigate = useNavigate();
  const [cartView, setCartView] = useState(false);

  let data = useCart();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">

        <div className="container-fluid">

          <Link
            className="navbar-brand fs-1 fst-italic"
            to="/"
          >
            GoFoodtest
          </Link>


          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >

            <span className="navbar-toggler-icon"></span>

          </button>



          <div
            className="collapse navbar-collapse"
            id="navbarNav"
          >


            <ul className="navbar-nav me-auto mb-2">


              <li className="nav-item">

                <Link
                  className="nav-link active fs-5"
                  to="/"
                >
                  Home
                </Link>

              </li>



              {
                localStorage.getItem("authToken") ?
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link active fs-5"
                        to="/myOrder"
                      >
                        My Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link active fs-5"
                        to="/favorites"
                      >
                        My Favourites
                      </Link>
                    </li>
                  </>
                  :
                  ""
              }


            </ul>




            {

              !localStorage.getItem("authToken") ?

                <div className="d-flex">


                  <Link
                    className="btn bg-white text-success mx-1"
                    to="/login"
                  >
                    Login
                  </Link>


                  <Link
                    className="btn bg-white text-success mx-1"
                    to="/createuser"
                  >
                    Sign Up
                  </Link>


                </div>


                :


                <div className="d-flex">


                  <button
                    className="btn bg-white text-success mx-2"
                    onClick={() => setCartView(true)}
                  >

                    My Cart 🛒

                    <span className="badge bg-danger ms-1">
                      {data.length}
                    </span>


                  </button>



                  <button
                    className="btn bg-white text-danger mx-2"
                    onClick={handleLogout}
                  >

                    Logout

                  </button>


                </div>

            }



          </div>

        </div>

      </nav>



      {
        cartView ?

          <Modal onClose={() => setCartView(false)}>

            <Cart />

          </Modal>

          :

          null
      }


    </>
  );
}