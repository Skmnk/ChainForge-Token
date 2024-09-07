const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const ChainForgePresale = await ethers.getContractFactory("ChainForgePresale");

  // Deploy the contract
  const chainForgePresale = await ChainForgePresale.deploy();
  await chainForgePresale.deployed();

  console.log("ChainForgePresale contract deployed to:", chainForgePresale.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });