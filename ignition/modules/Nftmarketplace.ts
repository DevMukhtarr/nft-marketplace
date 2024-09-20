import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const nftAddress = "";
const NftmarketplaceModule = buildModule("NftmarketplaceModule", (m) => {

  const nftmarketplace = m.contract("Nftmarketplace", [nftAddress]);

  return { nftmarketplace };
});

export default NftmarketplaceModule;
