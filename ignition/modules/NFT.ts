import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceNFTModule = buildModule("MarketplaceNFTModule", (m) => {

  const nft = m.contract("MarketplaceNFT");

  return { nft };
});

export default MarketplaceNFTModule;
