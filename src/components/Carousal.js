import React from 'react';

export default function Carousal() {
  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade carousel-dark"
      data-bs-ride="carousel"
      style={{ objectFit: "contain" }}
    >

      <div className="carousel-inner" id="carousel">

        <div className="carousel-caption" style={{ zIndex: "10" }}>
          <form className="d-flex">
            <input className="form-control me-2" type="search" placeholder="Search" />
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
        </div>

        <div className="carousel-item active">
          <img
            src="https://source.unsplash.com/1600x900/?burger"
            className="d-block w-100"
            style={{ height: "500px", objectFit: "cover" }}
            alt="burger"
          />
        </div>

        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            className="d-block w-100"
            style={{ height: "500px", objectFit: "cover" }}
            alt="food"
          />
        </div>

      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

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