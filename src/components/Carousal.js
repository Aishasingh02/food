import React from 'react';

export default function Carousal() {
  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >

      <div className="carousel-inner">

        {/* SEARCH BAR */}
        <div className="carousel-caption" style={{ zIndex: "10" }}>
          <form className="d-flex justify-content-center">
            <input
              className="form-control me-2 w-50"
              type="search"
              placeholder="Search food..."
            />
            <button className="btn btn-success">Search</button>
          </form>
        </div>

        {/* IMAGE 1 */}
        <div className="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349"
            className="d-block w-100"
            style={{ height: "500px", objectFit: "cover", filter: "brightness(40%)" }}
            alt="burger"
          />
        </div>

        {/* IMAGE 2 */}
        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
            className="d-block w-100"
            style={{ height: "500px", objectFit: "cover", filter: "brightness(40%)" }}
            alt="pizza"
          />
        </div>

      </div>

      {/* PREVIOUS BUTTON */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      {/* NEXT BUTTON */}
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>

    </div>
  );
}