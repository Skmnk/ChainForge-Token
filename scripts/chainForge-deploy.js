async function main() {
  // Get the contract factory
  const ChainForgeToken = await ethers.getContractFactory("ChainForgeToken");
  
  // Deploy the contract
  const chainForgeToken = await ChainForgeToken.deploy();
  
  // Wait for deployment to finish
  await chainForgeToken.deployed();

  console.log("ChainForgeToken deployed to:", chainForgeToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
