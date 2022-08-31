import { HeroSection, Footer } from '../components'
import logo1 from '../images/sneakerLogo.png'
import logo2 from '../images/sneakerLogo-mobile.png'
import logo3 from '../images/cusd.png'
import logo4 from '../images/ceur.png'
import logo5 from '../images/creal.png'
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';

const Home = () => {
    const [offset, setOffset] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        window.onscroll = () => {
            setOffset(window.pageYOffset);
        };
    }, []);

    return (
        <div className='App'>
            <div className='navHero'>
                <header className={offset ? "header is_scrolled" : "header"}>
                    <nav className="navbar">
                        <NavLink to="/">
                            <div className="navbar-logo">
                                <img src={logo1} alt="logo" />
                                <img src={logo2} alt="logo" />
                            </div>
                        </NavLink>

                        <div className={isActive ? "links-quote active" : "links-quote"}>
                            <div className="navbar-links">
                                <ul className="navbar-Ul">
                                    <li className="navbar-Li"><img src={logo3} alt='cusd' />0.00 cUSD</li>
                                    <li className="navbar-Li"><img src={logo4} alt='ceur' />0.00 cEUR</li>
                                    <li className="navbar-Li"><img src={logo5} alt='creal' />0.00 cREAL</li>
                                </ul>
                            </div>

                            <div className="navbar-quote">
                                <NavLink to="/app" className="quoteBtn">
                                    Enter App
                                </NavLink>
                            </div>
                        </div>

                        <div className="dropDown" onClick={() => { setIsActive(!isActive); console.log(isActive) }}>
                            <i class="fa-solid fa-bars"></i>
                        </div>
                    </nav>
                </header>
            </div>
            <HeroSection />
            <Footer />
        </div>

    )
}

export default Home