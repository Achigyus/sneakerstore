import { CeloProvider, useCelo, Alfajores, NetworkNames, SupportedProvider, SupportedProviders } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';
import BigNumber from 'bignumber.js';
import logo1 from '../images/sneakerLogo.png'
import logo2 from '../images/sneakerLogo-mobile.png'
import logo3 from '../images/cusd.png'
import logo4 from '../images/ceur.png'
import logo5 from '../images/creal.png'
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { Footer } from '../components'
import erc20Abi from "../contract/erc20Abi.json"
import sneakerstoreAbi from "../contract/sneakerstore.abi.json"
import Blockies from 'react-blockies'

const cEURContractAddress = "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
const cREALContractAddress = "0xE4D517785D091D3c54818832dB6094bcc2744545"
const MPContractAddress = "0xE6c04Bbaf5097101324DE011C7135018AA52Ff8A"
const ercAbi = erc20Abi.result
const ERC20_DECIMALS = 18
const readableNum = 1000000000000000000
let products = []

function WrappedSneaker() {

    return (
        <CeloProvider
            dapp={{
                name: 'Sneaker Store',
                description: 'A dApp that allows you buy sneakers on the Celo blockchain ',
                url: 'http://localhost:3001/app',
            }}
            connectModal={{
                // This options changes the title of the modal and can be either a string or a react element
                title: <span>Connect your Wallet</span>,
                providersOptions: {
                    hideFromDefaults: [
                        SupportedProviders.Valora,
                        SupportedProviders.CeloDance,
                        SupportedProviders.CeloTerminal,
                        SupportedProviders.Ledger,
                        SupportedProviders.PrivateKey,
                        SupportedProviders.Steakwallet,
                        SupportedProviders.CoinbaseWallet,
                        SupportedProviders.CeloWallet
                    ],
                    searchable: true
                },
            }}
            networks={[Alfajores]}
            network={{
                name: NetworkNames.Alfajores,
                rpcUrl: 'https://alfajores-forno.celo-testnet.org',
                graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
                explorer: 'https://alfajores-blockscout.celo-testnet.org',
                chainId: 44787,
            }}
        >
            <SneakerStore />
        </CeloProvider>
    )
}

function SneakerStore() {
    const [offset, setOffset] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isAddModal, setIsAddModal] = useState(false);
    const [isRender, setIsRender] = useState(false);
    const [isBuyModal, setIsBuyModal] = useState(-1);
    const [isEditModal, setIsEditModal] = useState(-1);
    const [products, setProducts] = useState(null);
    const { kit, connect, address, performActions } = useCelo();
    const [cUSDContract, setCUSDContract] = useState(null)
    const [cEURContract, setCEURContract] = useState(null)
    const [cREALContract, setCREALContract] = useState(null)
    const [editedAU, setEditedAU] = useState("")
    const [editedP, setEditedP] = useState("")
    const [isNotification, setIsNotification] = useState(true)
    const [notificationText, setNotificationText] = useState("⏳ Please connect your wallet to use the app...")
    const [cusdbal, setcusdbal] = useState("0.00")
    const [ceurbal, setceurbal] = useState("0.00")
    const [crealbal, setcrealbal] = useState("0.00")
    const [isConnected, setIsConnected] = useState("Connect Wallet")
    const [qtyToBuy, setQtyToBuy] = useState(0)

    useEffect(() => {
        window.onscroll = () => {
            setOffset(window.pageYOffset);
        };
    }, []);

    let contract

    async function approveCUSD(_price) {
        console.log(_price)
        await performActions(async (kit) => {
            const result = await cUSDContract.methods
                .approve(MPContractAddress, _price)
                .send({ from: address })
            return result
        })
    }

    async function approveCEUR(_price) {
        console.log(_price)
        await performActions(async (kit) => {
            const result = await cEURContract.methods
                .approve(MPContractAddress, _price)
                .send({ from: address })
            return result
        })
    }

    async function approveCREAL(_price) {
        console.log(_price)
        await performActions(async (kit) => {
            const result = await cREALContract.methods
                .approve(MPContractAddress, _price)
                .send({ from: address })
            return result
        })
    }

    const buyWithCUSD = async (e) => {
        let index = e.target.id
        let parseQty = parseInt(qtyToBuy)
        let approvedAmt = BigNumber(products[index].cUSDPrice).multipliedBy(parseQty)

        if (parseQty === 0) {
            notification(`Please select a quantity to buy 🙂`)
            setIsBuyModal(-1)
            return
        } else if (parseQty > products[index].unitsAvailable) {
            notification(`You can't buy more than the units available 🙃`)
            setIsBuyModal(-1)
            return
        }
        await performActions(async (kit) => {
            try {
                notification(`⌛ Buying ${products[index].name}. Please approve the txs, make sure you have enough cUSD...`)
                console.log((products[index].cUSDPrice))
                await approveCUSD(approvedAmt)
            } catch (error) {
                notification(`⚠️${error}`)
            }
        })

        await performActions(async (kit) => {
            try {
                contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
                const result = await contract.methods
                    .buySneakerCusd(index, parseQty)
                    .send({ from: address })
                notification(`🍾 You successfully bought ${products[index].name}`)
                getSneakers()
                getBalance()
                setIsBuyModal(-1)
                setTimeout(notificationOff, 3000)
            } catch (error) {
                notification(`⚠️${error}`)
                setIsBuyModal(-1)
            }
        })
    }

    const buyWithCEUR = async (e) => {
        let index = e.target.id
        let parseQty = parseInt(qtyToBuy)
        let approvedAmt = BigNumber(products[index].cEURPrice).multipliedBy(parseQty)

        if (parseQty === 0) {
            notification(`Please select a quantity to buy 🙂`)
            setIsBuyModal(-1)
            return
        } else if (parseQty > products[index].unitsAvailable) {
            notification(`You can't buy more than the units available 🙃`)
            setIsBuyModal(-1)
            return
        }
        await performActions(async (kit) => {
            try {
                notification(`⌛ Buying ${products[index].name}. Please confirm the tx, make sure you have enough cUSD...`)
                await approveCEUR(approvedAmt)
            } catch (error) {
                notification(`⚠️${error}`)
            }
        })

        await performActions(async (kit) => {
            try {
                contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
                const result = await contract.methods
                    .buySneakerCeur(index, parseQty)
                    .send({ from: address })
                notification(`🍾 You successfully bought ${products[index].name}`)
                getSneakers()
                getBalance()
                setIsBuyModal(-1)
                setTimeout(notificationOff, 3000)
            } catch (error) {
                notification(`⚠️${error}`)
                setIsBuyModal(-1)
            }
        })
    }

    const buyWithCREAL = async (e) => {
        let index = e.target.id
        let parseQty = parseInt(qtyToBuy)
        let approvedAmt = BigNumber(products[index].cREALPrice).multipliedBy(parseQty)

        if (parseQty === 0) {
            notification(`Please select a quantity to buy 🙂`)
            setIsBuyModal(-1)
            return
        } else if (parseQty > products[index].unitsAvailable) {
            notification(`You can't buy more than the units available 🙃`)
            setIsBuyModal(-1)
            return
        }
        await performActions(async (kit) => {
            try {
                notification(`⌛ Buying ${products[index].name}. Please confirm the tx, make sure you have enough cUSD...`)
                await approveCREAL(approvedAmt)
            } catch (error) {
                notification(`⚠️${error}`)
            }
        })

        await performActions(async (kit) => {
            try {
                contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
                const result = await contract.methods
                    .buySneakerCreal(index, parseQty)
                    .send({ from: address })
                notification(`🍾 You successfully bought ${products[index].name}`)
                getSneakers()
                getBalance()
                setIsBuyModal(-1)
                setTimeout(notificationOff, 3000)
            } catch (error) {
                notification(`⚠️${error}`)
                setIsBuyModal(-1)
            }
        })
    }

    const getBalance = async () => {
        let cUSDC = new kit.contracts.connection.web3.eth.Contract(erc20Abi, cUSDContractAddress)
        let cEURC = new kit.contracts.connection.web3.eth.Contract(erc20Abi, cEURContractAddress)
        let cREALC = new kit.contracts.connection.web3.eth.Contract(erc20Abi, cREALContractAddress)
        setCUSDContract(cUSDC)
        setCEURContract(cEURC)
        setCREALContract(cREALC)
        // console.log(cUSDContract)
        try {
            const cUSDbalance = await cUSDC.methods.balanceOf(address).call();
            const cEURbalance = await cEURC.methods.balanceOf(address).call();
            const cREALbalance = await cREALC.methods.balanceOf(address).call();
            const USDBalance = (cUSDbalance / readableNum).toFixed(2);
            const EURBalance = (cEURbalance / readableNum).toFixed(2);
            const REALBalance = (cREALbalance / readableNum).toFixed(2);
            setceurbal(EURBalance)
            setcusdbal(USDBalance)
            setcrealbal(REALBalance)
            console.log(USDBalance)
            console.log(EURBalance)
            console.log(REALBalance)

        } catch (error) {
            console.log(error);
        }
    }

    const getSneakers = async () => {
        contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
        const sneakersLength = await contract.methods.getSneakersLength().call();
        const sneakers = [];
        for (let i = 0; i < sneakersLength; i++) {
            let _sneaker = new Promise(async (resolve, reject) => {
                let p = await contract.methods.readSneakers(i).call()
                let g = await contract.methods.readSneakersDetails(i).call()

                resolve({
                    index: i,
                    owner: p[0],
                    name: p[1],
                    image: p[2],
                    description: p[3],
                    size: g[0],
                    unitsAvailable: g[1],
                    cUSDPrice: new BigNumber(g[2]),
                    cEURPrice: new BigNumber(g[3]),
                    cREALPrice: new BigNumber(g[4]),
                    sold: g[5],
                })
            });
            sneakers.push(_sneaker);
        }


        const _sneakers = await Promise.all(sneakers);
        setProducts(_sneakers);
        return _sneakers
    }

    async function newSneaker() {
        await performActions(async (kit) => {
            contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
            const params = [
                document.getElementById("productName").value,
                document.getElementById("imgUrl").value,
                document.getElementById("productDescription").value,
                document.getElementById("size").value,
                document.getElementById("availableUnits").value,
                new BigNumber(document.getElementById("price").value)
                    .shiftedBy(ERC20_DECIMALS)
                    .toString(),
                new BigNumber(document.getElementById("price").value * 1)
                    .shiftedBy(ERC20_DECIMALS)
                    .toString(),
                new BigNumber(document.getElementById("price").value * 5)
                .shiftedBy(ERC20_DECIMALS)
                .toString()
            ]
            console.log(params)
            try {
                notification(`⏳ Adding ${params[0]}, please confirm the tx`)
                const result = await contract.methods
                    .newSneaker(...params)
                    .send({ from: address })
                notification(`🍾 You successfully added ${params[0]}.`)
                getSneakers()
                setIsAddModal(false)
                setTimeout(notificationOff, 3000)
            } catch (error) {
                notification(`⚠️${error}`)
                setIsAddModal(false)
            }

        })
    }

    async function editSneaker(e) {
        let index = e.target.id
        performActions(async (kit) => {
            contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
            const params = [
                index,
                editedAU,
                new BigNumber(parseInt(editedP))
                    .shiftedBy(ERC20_DECIMALS)
                    .toString(),
                new BigNumber(parseInt(editedP) * 1)
                    .shiftedBy(ERC20_DECIMALS)
                    .toString(),
                new BigNumber(parseInt(editedP) * 5)
                .shiftedBy(ERC20_DECIMALS)
                .toString()
            ]
            console.log(params)
            try {
                notification(`⏳ Editing ${products[index].name}. Please approve the tx.`)
                const result = await contract.methods
                    .editSneaker(...params)
                    .send({ from: address })
                notification(`🍾 You successfully edited ${products[index].name}.`)
                getSneakers()
                setIsEditModal(-1)
                setTimeout(notificationOff, 3000)
            } catch (error) {
                notification(`⚠️${error}`)
                setIsEditModal(-1)
            }
        })
    }

    async function deleteSneaker(e) {
        let index = e.target.id
        contract = new kit.contracts.connection.web3.eth.Contract(sneakerstoreAbi, MPContractAddress)
        performActions(async () => {
            notification(`⌛ Deleting ${products[index].name}. Please confirm the tx...`)
            try {
                const result = await contract.methods
                    .removeSneakers(index)
                    .send({ from: address })
                notification(`🍾 You successfully deleted ${products[index].name}.`)
                getSneakers()
                setTimeout(notificationOff, 3000)
            } catch (error) {
                notification(`⚠️${error}`)
            }
        })
    }

    const notification = (text) => {
        setNotificationText(text)
        setIsNotification(true)
    }

    const notificationOff = () => {
        setIsNotification(false)
        setNotificationText("")
    }

    const fetchData = async () => {
        await connect()
        setIsConnected("Connecting...")
        await getBalance()
        await getSneakers()
        setTimeout(setIsRender(true), 3000)
        setIsConnected("Connected")
        notificationOff()
    }

    const getInput = (e) => {
        let input = e.target.value
        setQtyToBuy(input)
    }

    const con = () => {
        console.log(qtyToBuy)
    }

    const increaseQty = () => {
        setQtyToBuy((prevState)=>{
            return parseInt(prevState) + 1
        })
    }

    const decreaseQty = () => {
        setQtyToBuy((prevState)=>{
            return parseInt(prevState) - 1
        })
    }

    return (
        <div className='sneakerStore'>
            {/* Header */}
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
                                    <li className="navbar-Li" onClick={con}><img src={logo3} alt='cusd' />{cusdbal} cUSD</li>
                                    <li className="navbar-Li"><img src={logo4} alt='ceur' />{ceurbal} cEUR</li>
                                    <li className="navbar-Li"><img src={logo5} alt='creal' />{crealbal} cREAL</li>
                                </ul>
                            </div>

                            <div className="navbar-quote">
                                <button className="quoteBtn" onClick={() => fetchData()}>{isConnected}</button>
                            </div>
                        </div>

                        <div className="dropDown" onClick={() => { setIsActive(!isActive); console.log(isActive) }}>
                            <i className="fa-solid fa-bars"></i>
                        </div>
                    </nav>
                </header>
            </div>

            <div className='body-wrapper'>
                {/* Add item and notifications */}
                <div className='addNotif'>
                    <div className={isNotification ? 'notifications' : 'notifications-none'}>
                        <p>{notificationText}</p>
                    </div>

                    {isRender ?
                        <>
                            <button className='addBtn' onClick={() => setIsAddModal(true)}>Add Item</button>
                        </> :

                        <>
                            <div className="navbar-quote" style={{textAlign: "center"}}>
                                <button className="quoteBtn" onClick={() => fetchData()}>{isConnected}</button>
                            </div>
                        </>
                    }


                    <div className="addModal" style={isAddModal ? { display: "block" } : { display: "none" }}>
                        <div className="modal-content">
                            <span className="closeAddModal" onClick={() => setIsAddModal(false)}>&times;</span>
                            <form>
                                <div className="form-row">
                                    <div className="col">
                                        <input type="text" id="productName"
                                            placeholder="Enter name of product" />
                                    </div>
                                    <div className="col">
                                        <input type="text" id="imgUrl" placeholder="Enter image url" />
                                    </div>
                                    <div className="col">
                                        <input type="text" id="productDescription"
                                            placeholder="Enter product description" />
                                    </div>
                                    <div className="col">
                                        <input type="text" id="size" placeholder="Enter Size" />
                                    </div>
                                    <div className="col">
                                        <input type="text" id="availableUnits"
                                            placeholder="Enter Available Units" />
                                    </div>
                                    <div className="col">
                                        <input type="text" id="price" placeholder="Enter price" />
                                    </div>
                                </div>
                            </form>
                            <div className="modal-footer">
                                <button onClick={() => setIsAddModal(false)} type="button" className="closeAddModalBtn">
                                    Close
                                </button>
                                <button type="button" className="addProduct" onClick={() => newSneaker()}>
                                    Add product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Template for each item in the contract  */}
                <div className='cards'>
                    {!isRender ? <></> : <>
                        {products.map((sneaker) => (
                            <div className={sneaker.owner !== "0x0000000000000000000000000000000000000000" ? 'cards-container' : 'cards-box-none'} key={sneaker.index}>
                                <div className={sneaker.owner !== "0x0000000000000000000000000000000000000000" ? 'cards-box' : 'cards-box-none'} id={sneaker.index}>
                                    <div className="boxImg">
                                        <img className="boxImgImg" src={sneaker.image} alt="#" />
                                        <div className='uploaderProf'>
                                            <a href={`https://alfajores-blockscout.celo-testnet.org/address/${sneaker.owner}/transactions`} target="_blank">
                                                <Blockies
                                                    seed={sneaker.owner}
                                                    size={15}
                                                    scale={3}
                                                    className="identicon"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                    <div className='box-btm'>
                                        <p className="boxcont itemName">{sneaker.name}</p>
                                        <p className="boxcont itemDesc">{sneaker.description}</p>
                                        <p className='boxcont unitsAvail'>Size: {sneaker.size}</p>
                                        <p className='boxcont unitsAvail'>Units available: {sneaker.unitsAvailable}</p>
                                        <div className="selected">
                                            <p>{sneaker.sold}</p>
                                            <p>Sold</p>
                                        </div>
                                        <button className={sneaker.owner.toLowerCase() !== address.toLowerCase() && sneaker.unitsAvailable !== "0" ? 'buyNowBtn' : 'buyNowBtn-none'} onClick={() => {setIsBuyModal(sneaker.index) ; setQtyToBuy(0)}}>BUY NOW</button>
                                        <button className={sneaker.owner.toLowerCase() === address.toLowerCase() ? 'buyNowBtn' : 'buyNowBtn-none'} id={sneaker.index} onClick={deleteSneaker}>DELETE ITEM</button>
                                        <button className={sneaker.owner.toLowerCase() === address.toLowerCase() ? 'buyNowBtn' : 'buyNowBtn-none'} onClick={() => setIsEditModal(sneaker.index)}>EDIT ITEM</button>
                                        <button className={sneaker.unitsAvailable === "0" ? 'soldOutBtn' : 'buyNowBtn-none'} disabled>SOLD OUT</button>
                                    </div>
                                </div>

                                {/* buy modal */}
                                <div className="modal" style={isBuyModal === sneaker.index ? { display: "block" } : { display: "none" }}>
                                    <div className="modal-content">
                                        <span className="close" onClick={() => setIsBuyModal(-1)}>&times;</span>
                                        <div className="sneaker--details">
                                            <div className="sneakImg">
                                                <img src={sneaker.image} alt="#" />
                                            </div>
                                            <div className="title--desc">
                                                <p className="name">{sneaker.name}</p>
                                                <p className="size">Sizes Available: {sneaker.size}</p>
                                                <p className="desc">{sneaker.description}</p>
                                                <p className="desc">Units Available: {sneaker.unitsAvailable}</p>
                                            </div>
                                            <div className="size--buy">
                                                <div className='quantity'>
                                                    <i className="fa-solid fa-minus" onClick={decreaseQty}></i>
                                                    <input onChange={getInput} type="number" value={qtyToBuy} min={1} max={sneaker.unitsAvailable}/>
                                                    <i className="fa-solid fa-plus" onClick={increaseQty}></i>
                                                </div>
                                                <button className="buyCUSDBtn" onClick={buyWithCUSD} id={sneaker.index} aria-disabled="true">
                                                    Buy for {(sneaker.cUSDPrice / readableNum).toFixed(2)} cUSD
                                                </button>
                                                <button className="buyCEURBtn" onClick={buyWithCEUR} id={sneaker.index} aria-disabled="true">
                                                    Buy for {(sneaker.cEURPrice / readableNum).toFixed(2)} cEUR
                                                </button>
                                                <button className="buyCEURBtn" onClick={buyWithCREAL} id={sneaker.index} aria-disabled="true">
                                                    Buy for {(sneaker.cREALPrice / readableNum).toFixed(2)} cREAL
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* edit item modal */}
                                <div className="updateModal" style={isEditModal === sneaker.index ? { display: "block" } : { display: "none" }}>
                                    <div className="modal-content">
                                        <span className="closeUpdateModal" onClick={() => setIsEditModal(-1)}>&times;</span>
                                        <form>
                                            <div className="form-row">
                                                <div className="col">
                                                    <input type="text" onChange={(e) => setEditedAU(e.target.value)}
                                                        placeholder="Enter Available Units" />
                                                </div>
                                                <div className="col">
                                                    <input type="text" onChange={(e) => { setEditedP(e.target.value) }} placeholder="Enter price" />
                                                </div>
                                            </div>
                                        </form>
                                        <div className="modal-footer">
                                            <button onClick={() => setIsEditModal(-1)} type="button" className="closeUpdateModalBtn">
                                                Close
                                            </button>
                                            <button type="button" className="editProduct" id={sneaker.index} onClick={editSneaker}>
                                                Edit product
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>}

                </div>
            </div>

            {/* footer */}
            <Footer />
        </div>
    )
}


export default WrappedSneaker