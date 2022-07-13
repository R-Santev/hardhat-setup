import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-solhint";

import "./tasks/accounts";

dotenv.config();

const chainIds = {
  goerli: 5,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
};

// Ensure that we have all the environment variables we need.
const MNEMONIC: string | undefined = process.env.MNEMONIC;
if (!MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const INFURA_API_KEY: string | undefined = process.env.INFURA_API_KEY;
if (!INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const ETHERSCAN_API_KEY: string | undefined = process.env.ETHERSCAN_API_KEY;
if (!ETHERSCAN_API_KEY) {
  throw new Error("Please set your `ETHERSCAN_API_KEY` in a .env file");
}

function getChainConfig(network: keyof typeof chainIds): NetworkUserConfig {
  const url: string = "https://" + network + ".infura.io/v3/" + INFURA_API_KEY;
  return {
    accounts: {
      count: 10,
      mnemonic: MNEMONIC,
      path: "m/44'/60'/0'/0",
    },
    chainId: chainIds[network],
    url,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.11",
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/solidity-template/issues/31
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  networks: {
    hardhat: {
      // Fix: MetaMask mistakenly assumes all networks in http://localhost:8545 to have a chain id of 1337
      chainId: 1337,
    },
    goerli: getChainConfig("goerli"),
    kovan: getChainConfig("kovan"),
    rinkeby: getChainConfig("rinkeby"),
    ropsten: getChainConfig("ropsten"),
  },
  gasReporter: {
    currency: "USD",
    enabled: true,
  },
  typechain: {
    outDir: "types",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
