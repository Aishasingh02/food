import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Cards from '../components/Cards';
import Footer from '../components/Footer';

export default function Home() {
    const [search, setSearch] = useState("");
    const [foodCat, setFoodCat] = useState([]);
    const [foodItem, setFoodItem] = useState([]);

    const loadData = async () => {
        let response = await fetch("http://localhost:5000/api/foodData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        response = await response.json();

        console.log(response[0], response[1]);

        setFoodItem(response[0]);
        setFoodCat(response[1]);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <Navbar />

            {/* Carousel */}
            <div
                id="carouselExampleFade"
                className="carousel slide carousel-fade"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">

                    {/* Search Bar */}
                    <div className="carousel-caption" style={{ zIndex: 10 }}>
                        <div className="d-flex justify-content-center">
                            <input
                                className="form-control me-2 w-50"
                                type="search"
                                placeholder="Search food..."
                                aria-label="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Image 1 */}
                    <div className="carousel-item active">
                        <img
                            src="https://images.unsplash.com/photo-1550547660-d9450f859349"
                            className="d-block w-100"
                            style={{
                                height: "500px",
                                objectFit: "cover",
                                filter: "brightness(40%)",
                            }}
                            alt="burger"
                        />
                    </div>

                    {/* Image 2 */}
                    <div className="carousel-item">
                        <img
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591"
                            className="d-block w-100"
                            style={{
                                height: "500px",
                                objectFit: "cover",
                                filter: "brightness(40%)",
                            }}
                            alt="pizza"
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

            {/* Food Categories */}
            <div className="container">

                {foodCat.length !== 0 ? (
                    foodCat.map((data) => (
                        <div className="row mb-3" key={data._id || data.CategoryName}>

                            <div className="fs-3 m-3">
                                {data.CategoryName}
                            </div>

                            <hr />

                            {foodItem.length !== 0 ? (
                                foodItem
                                    .filter(
                                        (item) =>
                                            item.CategoryName === data.CategoryName &&
                                            item.name
                                                .toLowerCase()
                                                .includes(search.toLowerCase())
                                    )
                                    .map((filterItems) => (
                                        <div
                                            key={filterItems._id}
                                            className="col-12 col-md-6 col-lg-3"
                                        >
                                            <Cards
                                                foodItem={filterItems}
                                                options={filterItems.options[0]}
                                                
                                            />
                                        </div>
                                    ))
                            ) : (
                                <div>No such data</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No Category Found</div>
                )}

            </div>

            <Footer />
        </div>
    );
}