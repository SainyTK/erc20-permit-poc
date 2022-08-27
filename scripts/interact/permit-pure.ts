import hre, { ethers } from "hardhat";
import { ecsign } from "ethereumjs-util";
import {
  ERC20,
  ERC20Permit,
  PermitToken__factory,
} from "../../typechain-types";
import addresses from "../../utils/addresses";
import time from "../../utils/time";
import { BigNumberish } from "@ethersproject/bignumber";

const { utils } = ethers;
const {
  defaultAbiCoder,
  keccak256,
  toUtf8Bytes,
  solidityPack,
  parseEther,
  hexlify,
} = utils;

const PERMIT_TYPEHASH = keccak256(
  toUtf8Bytes(
    "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
  )
);

export async function getApprovalDigest(
  token: ERC20Permit,
  approve: {
    owner: string;
    spender: string;
    value: BigNumberish;
  },
  nonce: BigNumberish,
  deadline: BigNumberish
): Promise<string> {
  const DOMAIN_SEPARATOR = await token.DOMAIN_SEPARATOR();
  return keccak256(
    solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
            [
              PERMIT_TYPEHASH,
              approve.owner,
              approve.spender,
              approve.value,
              nonce,
              deadline,
            ]
          )
        ),
      ]
    )
  );
}

async function main() {
  const [signer1, signer2] = await ethers.getSigners();

  const addressList = await addresses.getAddressList(hre.network.name);
  const pmt = PermitToken__factory.connect(addressList["PMT"], signer1);

  const tx = await pmt
    .connect(signer2)
    .permit(
      "0x232cc14bf0c27fc01bddd84ac2d1a00d31349261",
      "0xB83aae754c8D3848Fe0675A3E172C7005B09B11f",
      "1000000000000000000",
      1671624828,
      28,
      "0xb7d909babf33caacd4ea403994686eb02b514217119e409d17652c3009180731",
      "0x0b471868d2e75c09a82879dcdeeee7982f70d6ecba7d0d6946a7cc225af18f45"
    );

  console.log("Permit success: ", tx.hash);

  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
