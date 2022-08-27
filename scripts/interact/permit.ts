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

  const TEST_AMOUNT = parseEther("1");
  const nonce = 0;
  const deadline = time.now() + time.duration.hours(1);

  const digest = await getApprovalDigest(
    pmt,
    { owner: signer1.address, spender: signer2.address, value: TEST_AMOUNT },
    nonce,
    deadline
  );

  const privateKey = "YOUR-SK";

  const { v, r, s } = ecsign(
    Buffer.from(digest.slice(2), "hex"),
    Buffer.from(privateKey.slice(2), "hex")
  );

  console.log({ v, r: hexlify(r), s: hexlify(s) });

  const tx = await pmt
    .connect(signer2)
    .permit(
      signer1.address,
      signer2.address,
      TEST_AMOUNT,
      deadline,
      v,
      hexlify(r),
      hexlify(s)
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
