import React from "react";
import { NavLink } from "react-router-dom";

function HeroSection() {
    return (
        <div className="heroSection">
            <div className="heroSection-container">
                <h1>Life is too short <br/> for bad shoes.</h1>
                <NavLink to="/app">
                    Enter App
                </NavLink>
            </div>
        </div>
    )
}

export default HeroSection