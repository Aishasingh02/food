import React from 'react'
import Navbar from '../components/Navbar'
import Cards from '../components/Cards'
import Footer from '../components/Footer'
import Carousal from '../components/Carousal'


export default function Home() {
    return (
        <div>
            <div> <Navbar /> </div>
            <div> <Carousal /> </div>

            <div className="container">
                <div className="row">

                    <div className="col-md-3"><Cards /></div>
                    <div className="col-md-3"><Cards /></div>
                    <div className="col-md-3"><Cards /></div>
                    <div className="col-md-3"><Cards /></div>

                </div>
            </div>
            <div className='m-1'> <Footer /></div>
        </div>
    )
}
