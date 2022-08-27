import hre, { ethers } from "hardhat";
import { PermitToken__factory } from "../../typechain-types";
import addresses from "../../utils/addresses";

async function main() {
  const [signer1, signer2] = await ethers.getSigners();

  const addressList = await addresses.getAddressList(hre.network.name);
  const pmt = PermitToken__factory.connect(addressList["PMT"], signer1);

  const amount = ethers.utils.parseEther("1");
  const tx = await pmt
    .connect(signer2)
    .transferFrom(signer1.address, signer2.address, amount);

  console.log("Pull token success: ", tx.hash);

  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
