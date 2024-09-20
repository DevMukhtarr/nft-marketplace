// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftMarketplace is ERC721 {
    uint256 private _nextTokenId = 1;
    address public owner;

    struct ListedNFT {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => ListedNFT) public listedNFTs;

    event NewNFTMinted(uint256 indexed tokenId, address owner);

    event Listed(uint256 indexed tokenId, uint256 price);

    event UnListed(uint256 indexed tokenId);

    event Bought(uint256 indexed tokenId, address buyer, uint256 price);

    constructor() ERC721("Marketplace NFT", "MNFT") {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function mintNFT(address to) public onlyOwner {
        require(to != address(0), "Address 0 spotted");
        uint256 tokenId = _nextTokenId;
        _nextTokenId++; 
        _safeMint(to, tokenId);
        emit NewNFTMinted(tokenId, to);
    }

    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "only owner can list this NFT");
        require(price > 0, "price must be greater than zero");
        
        listedNFTs[tokenId] = ListedNFT({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            isListed: true
        });
        emit Listed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) public payable {
        ListedNFT storage listedNFT = listedNFTs[tokenId];
        require(listedNFT.isListed, "NFT is not listed for sale");
        require(msg.value >= listedNFT.price, "Insufficient funds to buy NFT");

        address payable seller = listedNFT.seller;

        _transfer(seller, msg.sender, tokenId);

        seller.transfer(msg.value);

        listedNFT.isListed = false;

        emit Bought(tokenId, msg.sender, listedNFT.price);
    }

    function unlistNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can unlist this NFT");
        require(listedNFTs[tokenId].isListed, "NFT is not listed");

        listedNFTs[tokenId].isListed = false;
        emit UnListed(tokenId);
    }

    function getListedNFT(uint256 tokenId) public view returns (ListedNFT memory) {
        require(listedNFTs[tokenId].isListed, "NFT is not listed");
        return listedNFTs[tokenId];
    }
}
