import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NftmarketplaceModule = buildModule("NftmarketplaceModule", (m) => {

  const nftmarketplace = m.contract("Nftmarketplace");

  return { nftmarketplace };
});

export default NftmarketplaceModule;
