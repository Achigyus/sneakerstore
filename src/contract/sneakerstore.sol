// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
  function transfer(address, uint256) external returns (bool);
  function approve(address, uint256) external returns (bool);
  function transferFrom(address, address, uint256) external returns (bool);
  function totalSupply() external view returns (uint256);
  function balanceOf(address) external view returns (uint256);
  function allowance(address, address) external view returns (uint256);

  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Sneakerstore {

    uint internal sneakersLength = 0;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address internal cEurTokenAddress = 0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F;
    address internal cRealTokenAddress = 0xE4D517785D091D3c54818832dB6094bcc2744545;

    struct Sneaker {
        address payable owner;
        string name;
        string image;
        string description;
        uint size;
        uint unitsAvailable;
        uint cUSDPrice;
        uint cEURPrice;
        uint cREALPrice;
        uint sold;
    }

    mapping (uint => Sneaker) internal sneakers;

    modifier onlyOwner(uint _index){
        require(msg.sender == sneakers[_index].owner, "Only the owner can access this function");
        _;
    }

    modifier isAvailable(uint _index, uint _quantity){
        require(sneakers[_index].unitsAvailable > _quantity, "Not enough Stocks");
        _;
    }

    modifier notOwner(uint _index){
        require(msg.sender != sneakers[_index].owner, "Owner cannot buy their sneaker");
        _;
    }

    function newSneaker(
        string memory _name,
        string memory _image,
        string memory _description,
        uint _size, 
        uint _unitsAvailable, 
        uint _price,
        uint _cEURPrice,
        uint _cREALPrice
    ) public {
        uint _sold = 0;
        sneakers[sneakersLength] = Sneaker(
            payable(msg.sender),
            _name,
            _image,
            _description,
            _size,
            _unitsAvailable,
            _price,
            _cEURPrice,
            _cREALPrice,
            _sold
        );
        sneakersLength++;
    }

    //Buy Functions

    function buySneakerCusd(uint _index, uint _quantity) public payable isAvailable(_index, _quantity) notOwner(_index) {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            sneakers[_index].owner,
            sneakers[_index].cUSDPrice * _quantity
          ),
          "Transfer failed."
        );
        makeSaleAdjustments(_index, _quantity);
    }

    function buySneakerCeur(uint _index, uint _quantity) public payable isAvailable(_index, _quantity) notOwner(_index){
        require(
          IERC20Token(cEurTokenAddress).transferFrom(
            msg.sender,
            sneakers[_index].owner,
            sneakers[_index].cEURPrice * _quantity
          ),
          "Transfer failed."
        );
        makeSaleAdjustments(_index, _quantity);
    }

    function buySneakerCreal(uint _index, uint _quantity) public payable  isAvailable(_index, _quantity) notOwner(_index){
        require(
          IERC20Token(cRealTokenAddress).transferFrom(
            msg.sender,
            sneakers[_index].owner,
            sneakers[_index].cREALPrice * _quantity
          ),
          "Transfer failed."
        );
        makeSaleAdjustments(_index, _quantity);
    }
    
    function makeSaleAdjustments(uint _index, uint _quantity) internal{
        sneakers[_index].sold+= _quantity;
        sneakers[_index].unitsAvailable-= _quantity;
    }


    function editSneaker(
        uint _index,
        string memory _name,
        string memory _image,
        string memory _description,
        uint _size,
        uint _unitsAvailable, 
        uint _price,
        uint _cEURPrice,
        uint _cREALPrice 
        )
        public onlyOwner(_index){
        sneakers[_index].name = _name;
        sneakers[_index].image = _image;
        sneakers[_index].description =  _description;
        sneakers[_index].size =  _size;
        sneakers[_index].unitsAvailable = _unitsAvailable;
        sneakers[_index].cUSDPrice = _price;
        sneakers[_index].cEURPrice = _cEURPrice;
        sneakers[_index].cREALPrice = _cREALPrice;
    }

    
    function removeSneakers( uint _index) public onlyOwner(_index){
        delete sneakers[_index];
    }

    //View Functions

    function readSneakers(uint _index) public view returns (
        address payable,
        string memory, 
        string memory, 
        string memory
    ) {
        return (
            sneakers[_index].owner,
            sneakers[_index].name, 
            sneakers[_index].image, 
            sneakers[_index].description
        );
    }

    function readSneakersDetails(uint _index) public view returns (
        uint,
        uint,
        uint,
        uint,
        uint,
        uint
    ) { 
        return (
        sneakers[_index].size,
        sneakers[_index].unitsAvailable,
        sneakers[_index].cUSDPrice,
        sneakers[_index].cEURPrice,
        sneakers[_index].cREALPrice,
        sneakers[_index].sold
        );
    }

    function getSneakersLength() public view returns (uint) {
        return (sneakersLength);
    }
}