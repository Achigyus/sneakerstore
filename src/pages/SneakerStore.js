/* eslint-disable jsx-a11y/anchor-is-valid */
import logo1 from '../images/sneakerLogo.png'
import logo2 from '../images/sneakerLogo-mobile.png'
import logo3 from '../images/cusd.png'
import logo4 from '../images/ceur.png'
import logo5 from '../images/creal.png'
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { Footer } from '../components'


const SneakerStore = () => {
    const [offset, setOffset] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isAddModal, setIsAddModal] = useState(false);
    const [isBuyModal, setIsBuyModal] = useState(-1);
    const [isEditModal, setIsEditModal] = useState(-1);

    useEffect(() => {
        window.onscroll = () => {
            setOffset(window.pageYOffset);
        };
    }, []);

    return (
        <div className='sneakerStore'>
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
                                <button className="quoteBtn">Connect Wallet</button>
                            </div>
                        </div>

                        <div className="dropDown" onClick={() => { setIsActive(!isActive); console.log(isActive) }}>
                            <i class="fa-solid fa-bars"></i>
                        </div>
                    </nav>
                </header>
            </div>
            <div className='body-wrapper'>
                <div className='addNotif'>
                    <div className='notifications'>
                        <p>⌛ Adding "RTFKT Space Drip"...</p>
                    </div>

                    <button className='addBtn' onClick={()=>setIsAddModal(true)}>Add Item</button>

                    <div class="addModal" style={isAddModal ? { display: "block" } : { display: "none" }}>
                        <div class="modal-content">
                            <span class="closeAddModal" onClick={() => setIsAddModal(false)}>&times;</span>
                            <form>
                                <div class="form-row">
                                    <div class="col">
                                        <input type="text" id="productName"
                                            placeholder="Enter name of product" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="imgUrl" placeholder="Enter image url" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="productDescription"
                                            placeholder="Enter product description" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="size" placeholder="Enter Size" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="availableUnits"
                                            placeholder="Enter Available Units" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="price" placeholder="Enter price" />
                                    </div>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button onClick={() => setIsAddModal(false)} type="button" class="closeAddModalBtn">
                                    Close
                                </button>
                                <button type="button" class="addProduct">
                                    Add product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='cards'>
                    <div className='cards-box' id="1">
                        <div className="boxImg">
                            <img className="boxImgImg" src={logo2} alt="#" />
                            <div className='uploaderProf'>
                                <a href='#'>
                                    <img src={logo2} style={{ width: "48px" }} alt="logo" />
                                </a>
                            </div>
                        </div>
                        <div className='box-btm'>
                            <p className="boxcont itemName">Item Name</p>
                            <p className="boxcont itemDesc">Item Description</p>
                            <p className='boxcont unitsAvail'>Units available: 3</p>
                            <div className="selected">
                                <p>0</p>
                                <p>Sold</p>
                            </div>
                            <button className='buyNowBtn' onClick={() => setIsBuyModal(1)}>BUY NOW</button>
                            <button className='buyNowBtn'>BUY NOW</button>
                            <button className='buyNowBtn' onClick={() => setIsEditModal(1)}>EDIT ITEM</button>
                        </div>
                    </div>

                    <div class="modal" style={isBuyModal === 1 ? { display: "block" } : { display: "none" }}>
                        <div class="modal-content">
                            <span class="close" onClick={() => setIsBuyModal(-1)}>&times;</span>
                            <div class="sneaker--details">
                                <div class="sneakImg">
                                    <img src={logo2} alt="#" />
                                </div>
                                <div class="title--desc">
                                    <p class="name">product.name</p>
                                    <p class="size">Sizes Available: product.size</p>
                                    <p class="desc">product.description</p>
                                </div>
                                <div class="size--buy">
                                    <button class="buyCUSDBtn" aria-disabled="true">
                                        Buy for 2 cUSD
                                    </button>
                                    <button class="buyCEURBtn" aria-disabled="true">
                                        Buy for 1 cEUR
                                    </button>
                                    <button class="buyCREALBtn" aria-disabled="true">
                                        Buy for 1 cREAL
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="updateModal" style={isEditModal === 1 ? { display: "block" } : { display: "none" }}>
                        <div class="modal-content">
                            <span class="closeUpdateModal" onClick={() => setIsEditModal(-1)}>&times;</span>
                            <form>
                                <div class="form-row">
                                    <div class="col">
                                        <input type="text" id="editedProductName"
                                            placeholder="Enter name of product" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="editedImgUrl" placeholder="Enter image url" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="editedProductDescription"
                                            placeholder="Enter product description" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="editedsize" placeholder="Enter Size" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="editedavailableUnits"
                                            placeholder="Enter Available Units" />
                                    </div>
                                    <div class="col">
                                        <input type="text" id="editedPrice" placeholder="Enter price" />
                                    </div>
                                </div>
                            </form>
                            <div class="modal-footer">
                                <button onClick={() => setIsEditModal(-1)} type="button" class="closeUpdateModalBtn">
                                    Close
                                </button>
                                <button type="button" class="editProduct">
                                    Edit product
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='cards-box'>
                        <div className="boxImg">
                            <img className="boxImgImg" src={logo2} alt="#" />
                            <div className='uploaderProf'>
                                <a href='#'>
                                    <img src={logo2} style={{ width: "48px" }} />
                                </a>
                            </div>
                        </div>
                        <div className='box-btm'>
                            <p className="boxcont itemName">Item Name</p>
                            <p className="boxcont itemDesc">Item Description</p>
                            <p className='boxcont unitsAvail'>Units available: 3</p>
                            <div className="selected">
                                <p>0</p>
                                <p>Sold</p>
                            </div>
                            <button className='buyNowBtn'>BUY NOW</button>
                        </div>
                    </div>

                    <div className='cards-box'>
                        <div className="boxImg">
                            <img className="boxImgImg" src={logo2} alt="#" />
                            <div className='uploaderProf'>
                                <a href='#'>
                                    <img src={logo2} style={{ width: "48px" }} />
                                </a>
                            </div>
                        </div>
                        <div className='box-btm'>
                            <p className="boxcont itemName">Item Name</p>
                            <p className="boxcont itemDesc">Item Description</p>
                            <p className='boxcont unitsAvail'>Units available: 3</p>
                            <div className="selected">
                                <p>0</p>
                                <p>Sold</p>
                            </div>
                            <button className='buyNowBtn'>BUY NOW</button>
                        </div>
                    </div>

                    <div className='cards-box'>
                        <div className="boxImg">
                            <img className="boxImgImg" src={logo2} alt="#" />
                            <div className='uploaderProf'>
                                <a href='#'>
                                    <img src={logo2} style={{ width: "48px" }} />
                                </a>
                            </div>
                        </div>
                        <div className='box-btm'>
                            <p className="boxcont itemName">Item Name</p>
                            <p className="boxcont itemDesc">Item Description</p>
                            <p className='boxcont unitsAvail'>Units available: 3</p>
                            <div className="selected">
                                <p>0</p>
                                <p>Sold</p>
                            </div>
                            <button className='buyNowBtn'>BUY NOW</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default SneakerStore