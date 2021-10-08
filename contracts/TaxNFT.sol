// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaxNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 public constant PRICE = 0.08 ether;
    uint256 public constant MAX_MINT = 10;

    string private _contractURI;
    string private _tokenBaseURI = "https://svs.gg/api/metadata/";

    constructor() ERC721("TaxNFT", "TAX") { }

    function mint(uint256 tokenQuantity) external payable {
        require(tokenQuantity <= MAX_MINT, "Cannot mint more than 10 at once.");
        require(PRICE * tokenQuantity <= msg.value, "Insufficient ETH.");

        for(uint256 i = 0; i < tokenQuantity; i++) {
            _safeMint(msg.sender, totalSupply() + 1);
        }
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function setContractURI(string calldata URI) external onlyOwner {
        _contractURI = URI;
    }

    function setBaseURI(string calldata URI) external onlyOwner {
        _tokenBaseURI = URI;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "Cannot query non-existent token");

        return string(abi.encodePacked(_tokenBaseURI, tokenId.toString()));
    }
}