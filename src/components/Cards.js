import React from 'react'

export default function Cards() {
    return (
        <div> <div>
            <div className="card mt-3" style={{ "width": "18rem", "maxHeight": "360px" }}>
                <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1600&q=80" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">This is the Important Text.</p>
                    <div className='container w-100'>
                        <select className='m-2 h-100 bg-success'>
                            {Array.from(Array(6), (e, i) => {
                                return (
                                    <option key={i + 1} value={i + 1}> {i + 1}</option>
                                )
                            })}
                        </select>
                        <select className='m-2 h-100 bg-success'>
                            <option value="half" >Half</option>
                            <option value="full" >Full</option>
                        </select>
                        <div className='d-inline h-100 fs-5'>
                            Total price

                        </div>
                        <button className="btn btn-primary w-100 bg success">Order Now</button>

                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
