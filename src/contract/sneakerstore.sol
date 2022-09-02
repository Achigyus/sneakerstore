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
        uint price;
        uint cEURPrice;
        uint cREALPrice;
        uint sold;
    }

    mapping (uint => Sneaker) internal sneakers;

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
        sneakers[_index].price,
        sneakers[_index].cEURPrice,
        sneakers[_index].cREALPrice,
        sneakers[_index].sold
        );
    }

    function buySneakerCusd(uint _index) public payable  {
        require(!(sneakers[_index].unitsAvailable == 0),
            "Sold out"
        );

        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            sneakers[_index].owner,
            sneakers[_index].price
          ),
          "Transfer failed."
        );
        sneakers[_index].sold++;
        sneakers[_index].unitsAvailable--;
    }

    function buySneakerCeur(uint _index) public payable  {
        require(!(sneakers[_index].unitsAvailable == 0),
            "Sold out"
        );

        require(
          IERC20Token(cEurTokenAddress).transferFrom(
            msg.sender,
            sneakers[_index].owner,
            sneakers[_index].cEURPrice
          ),
          "Transfer failed."
        );
        sneakers[_index].sold++;
        sneakers[_index].unitsAvailable--;
    }

    function buySneakerCreal(uint _index) public payable  {
        require(!(sneakers[_index].unitsAvailable == 0),
            "Sold out"
        );

        require(
          IERC20Token(cRealTokenAddress).transferFrom(
            msg.sender,
            sneakers[_index].owner,
            sneakers[_index].cREALPrice
          ),
          "Transfer failed."
        );
        sneakers[_index].sold++;
        sneakers[_index].unitsAvailable--;
    }
    
    function getSneakersLength() public view returns (uint) {
        return (sneakersLength);
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
        public {
        require(sneakers[_index].owner == msg.sender,"Access denied!,only artwork owner can edit artwork");
        sneakers[_index].name = _name;
        sneakers[_index].image = _image;
        sneakers[_index].description =  _description;
        sneakers[_index].size =  _size;
        sneakers[_index].unitsAvailable = _unitsAvailable;
        sneakers[_index].price = _price;
        sneakers[_index].cEURPrice = _cEURPrice;
        sneakers[_index].cREALPrice = _cREALPrice;
    }

    
    function removeSneakers( uint _index) public {
        require(sneakers[_index].owner == msg.sender,"Access denied!,only artwork owner can remove artwork");
        delete sneakers[_index];
    }
}