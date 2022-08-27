import hre, { ethers } from "hardhat";
import addresses from "../utils/addresses";

async function main() {
  const intialSupply = ethers.utils.parseEther("1000");

  const PermitToken = await ethers.getContractFactory("PermitToken");
  const permitToken = await PermitToken.deploy(intialSupply);

  console.log("Permit token is deployed at ", permitToken.address);

  await addresses.saveAddresses(hre.network.name, { PMT: permitToken.address });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
