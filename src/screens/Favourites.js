import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Cards from "../components/Cards";

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadFavorites = async () => {
    const authToken = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    try {
      setLoading(true);
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

      const data = await response.json();
      console.log("Favorites response:", data);

      if (data.success) {
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleFavoriteToggle = (foodId, isFav) => {
    if (!isFav) {
      setFavorites((prev) =>
        prev.filter((item) => (item._id ? item._id.toString() : item.toString()) !== foodId.toString())
      );
    }
  };

  const filteredFavorites = favorites.filter((item) =>
    item.name ? item.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="container mt-4 mb-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 pb-2 border-bottom">
          <div>
            <h2 className="text-success fw-bold m-0">
              ❤️ My Favourites
            </h2>
            <p className="text-muted small m-0 mt-1">
              Your saved favorite dishes in one place
            </p>
          </div>

          {favorites.length > 0 && (
            <div className="mt-2 mt-md-0" style={{ minWidth: "250px" }}>
              <input
                type="search"
                className="form-control"
                placeholder="Search favourites..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading your favourites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center my-5 py-5 bg-light rounded-3 shadow-sm p-4">
            <div style={{ fontSize: "50px" }}>🍽️</div>
            <h4 className="fw-bold mt-3">You don't have any favourite items yet!</h4>
            <p className="text-muted">
              Explore delicious items on the menu and tap the ❤️ icon to save them here.
            </p>
            <Link to="/" className="btn btn-success mt-2 px-4 py-2 fw-semibold">
              Explore Menu
            </Link>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center my-5">
            <h5>No favourite items match "{search}"</h5>
          </div>
        ) : (
          <div className="row g-4">
            {filteredFavorites.map((item) => {
              const options =
                Array.isArray(item.options) && item.options.length > 0
                  ? item.options[0]
                  : item.options || {};

              return (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  key={item._id}
                >
                  <Cards
                    foodItem={item}
                    options={options}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}