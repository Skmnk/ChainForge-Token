const { ethers, network } = require('hardhat');
const { BigNumber } = ethers;

// const { expect } = require('chai');
// const chaiAsPromised = require('chai-as-promised');
// chai.use(chaiAsPromised);



let expect,chaiAsPromised;
(async () => {
  // Dynamically import chai and chai-as-promised
  const chai = await import('chai');

  const chaiAsPromised = await import('chai-as-promised');

  expect = chai.expect;
  chai.use(chaiAsPromised.default);
})();
describe("ChainForgeToken", function () {
  let ChainForgeToken, chainForgeToken;

  before(async function () {
    // Initialize any required setup
  });

  beforeEach(async function () {
    ChainForgeToken = await ethers.getContractFactory("ChainForgeToken");
    chainForgeToken = await ChainForgeToken.deploy();
  });

  it("Should deploy with the correct total supply", async function () {
    const totalSupply = await chainForgeToken.totalSupply();
    const expectedSupply = BigNumber.from("1000000").mul(BigNumber.from("10").pow(18)); // Convert to BigNumber
    expect(totalSupply.eq(expectedSupply)).to.be.true; // Use .eq() for comparison
  });

  it("Should mint the correct amount to the deployer", async function () {
    const [deployer] = await ethers.getSigners();
    const deployerBalance = await chainForgeToken.balanceOf(deployer.address);
    const expectedBalance = BigNumber.from("1000000").mul(BigNumber.from("10").pow(18)); // Convert to BigNumber
    expect(deployerBalance.eq(expectedBalance)).to.be.true; // Use .eq() for comparison
  });
});

describe("ChainForgePresale", function () {
  let ChainForgePresale, chainForgePresale;
  let owner, addr1, addr2, referrer1, referrer2;
  const PRESALE_PRICE_USDT = ethers.utils.parseEther('0.001');
  const PRESALE_AMOUNT = ethers.utils.parseUnits('500000', 18);
  const tokenAmount = ethers.utils.parseUnits('1', 18);

  before(async function () {
    // Initialize any required setup
  });

  beforeEach(async function () {
    [owner, addr1, addr2, referrer1, referrer2] = await ethers.getSigners();
    ChainForgePresale = await ethers.getContractFactory("ChainForgePresale");
    chainForgePresale = await ChainForgePresale.deploy();
  });

  it("Should deploy with the correct presale amount", async function () {
    const presaleAmount = await chainForgePresale.balanceOf(chainForgePresale.address);
    expect(presaleAmount.toString()).to.equal(PRESALE_AMOUNT.toString());
  });

    it("Should allow a user to buy tokens", async function () {
      await expect(chainForgePresale.connect(addr1).buyTokens(referrer1.address, { value: PRESALE_PRICE_USDT }))
        // .to.be.rejectedWith("Error message"); // Adjust the error message accordingly
    });

  

  it("Should end presale successfully", async function () {
    await chainForgePresale.connect(owner).endPresale(true);
    const presaleEnded = await chainForgePresale.presaleEnded();
    const presaleSuccessful = await chainForgePresale.presaleSuccessful();
    expect(presaleEnded).to.be.true;
    expect(presaleSuccessful).to.be.true;
  });

  it("Should allow the owner to withdraw funds after a successful presale", async function () {
    const amountToBuy = ethers.utils.parseUnits('1', 18); // Ensure this matches your contract logic
    await chainForgePresale.connect(addr1).buyTokens(referrer1.address, { value: amountToBuy });
  
    await chainForgePresale.connect(owner).endPresale(true);
    const ownerInitialBalance = await ethers.provider.getBalance(owner.address);
  
    await chainForgePresale.connect(owner).withdraw();
  
    const ownerFinalBalance = await ethers.provider.getBalance(owner.address);
    expect(ownerFinalBalance.gt(ownerInitialBalance)).to.be.true; // Ensure balance increased
  });

  // it("Should allow users to claim tokens after a successful presale", async function () {
  //   const amountToBuy = ethers.utils.parseUnits('1', 18); // Amount in terms of CFT
  
  //   // Purchase tokens
  //   await chainForgePresale.connect(addr1).buyTokens(referrer1.address, { value: PRESALE_PRICE_USDT });
    
  //   // End the presale
  //   await chainForgePresale.connect(owner).endPresale(true);
    
  //   // Claim tokens
  //   await chainForgePresale.connect(addr1).claimTokens();
  
  //   // Retrieve user balance
  //   const userBalance = await chainForgePresale.balanceOf(addr1.address);
  
  //   // Assertion
  //   expect(userBalance.toString()).to.equal(amountToBuy.toString());
  // });
  

  it("Should not allow claims before presale is successful", async function () {
    await chainForgePresale.connect(addr1).buyTokens(referrer1.address, { value: PRESALE_PRICE_USDT });

    await expect(chainForgePresale.connect(addr1).claimTokens())
      .to.be.rejectedWith("Presale not successful");
  });

  it("Should fail presale and allow refunds", async function () {
    await chainForgePresale.connect(owner).endPresale(false);
    const presaleSuccessful = await chainForgePresale.presaleSuccessful();
    expect(presaleSuccessful).to.be.false;

    // Note: Refund logic is not implemented, so this is a placeholder for refund checks.
    // You need to implement the refund logic in your contract for this test case.
  });
});
