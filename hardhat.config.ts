import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import accountUtils from "./utils/accounts";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    kubchain_test: {
      url: `https://rpc-testnet.bitkubchain.io`,
      accounts: accountUtils.getAccounts(),
    },
  },
};

export default config;
