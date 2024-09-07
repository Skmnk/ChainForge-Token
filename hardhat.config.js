/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
// require('chai');
// require('chai-as-promised');
require('@nomiclabs/hardhat-ethers');


module.exports = {
  solidity: "0.8.24",

  networks: {
    hardhat: {},
    // Uncomment and configure the following if you are deploying to a testnet/mainnet
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID",
    //   accounts: ["YOUR_PRIVATE_KEY"]
    // }
  },

  paths: {
    tests: "./test", // Ensure the path is correct for your test files
  },
  mocha: {
    timeout: 20000 // Increase if your tests are timing out
  }
};
