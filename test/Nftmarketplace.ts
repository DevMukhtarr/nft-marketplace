import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("EventNft", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployNftAndEventContract() {

    // Contracts are deployed using the first signer/account by default
    const [owner, account2, account3] = await hre.ethers.getSigners();

    const NFT = await hre.ethers.getContractFactory("MarketplaceNFT ");
    const nft = await NFT.deploy();

    const MARKETPLACE = await hre.ethers.getContractFactory("NftMarketplace")
    const marketplace = await MARKETPLACE.deploy(await nft.getAddress());

    return { nft, owner, marketplace,account2, account3 };
  }

  describe("Deployment", function () {
    it("Should check if owner is set properly", async function () {
      const { nft, owner } = await loadFixture(deployNftAndEventContract);
      
      // check is address is correct
      expect(await nft.getAddress()).to.equal(nft.target)

      // check if owner is set properly
      expect(await nft.owner()).to.equal(owner)
    });

    it("Should check if NFT address is set properly in marketplace", async function () {
      const { nft,marketplace } = await loadFixture(deployNftAndEventContract);

      expect(await marketplace.nftAddress()).is.equal(await nft.getAddress())
    })
  });

  it("Should check if mint is working properly", async function () {
    const { nft, owner, account2 } = await loadFixture(deployNftAndEventContract);

    await nft.mint(owner)
    await nft.mint(account2)

    expect(await nft.balanceOf(account2) > 0)

    await expect(nft.mint(account2))  
    .to
    .emit(nft, "NftMinted")
    .withArgs(account2, await nft.tokenId())
  });
});