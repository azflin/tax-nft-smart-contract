// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaxNFT is ERC721Enumerable, Ownable {

    uint256 public constant PRICE = 0.08 ether;
    uint256 public constant MAX_MINT = 10;
    bool public mintingPaused = false;
    address public dev1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public dev2 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    address public otherPayee = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
    mapping(uint => bool) public claimedCode;

    string private _contractURI = "https://dummyurl.com/contract_metadata/";
    string private _tokenURI = "https://dummyurl.com/metadata/";

    constructor() ERC721("TaxNFT", "TAX") { }

    function mint(uint256 _tokenQuantity) external payable {
        require(!mintingPaused, "Minting has been paused.");
        require(_tokenQuantity <= MAX_MINT, "Cannot mint more than 10 at once.");
        require(PRICE * _tokenQuantity <= msg.value, "Insufficient ETH.");

        for(uint256 i = 0; i < _tokenQuantity; i++) {
            _safeMint(msg.sender, totalSupply() + 1);
        }
    }

    function claimCode(uint _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "You do not own this tokenId");
        claimedCode[_tokenId] = true;
    }

    function setMintingPaused(bool _mintingPaused) external onlyOwner {
        mintingPaused = _mintingPaused;
    }

    function withdraw() external {
        uint devPayment = address(this).balance/20;
        bool success;
        (success, ) = payable(dev1).call{value: devPayment}("");
        require(success, "Withdraw failed.");
        (success, ) = payable(dev2).call{value: devPayment}("");
        require(success, "Withdraw failed.");
        (success, ) = payable(otherPayee).call{value: address(this).balance}("");
        require(success, "Withdraw failed.");
    }

    function setContractURI(string calldata URI) external onlyOwner {
        _contractURI = URI;
    }

    function setTokenURI(string calldata URI) external onlyOwner {
        _tokenURI = URI;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "Cannot query non-existent token");
        return _tokenURI;
    }
}