// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChainForgePresale is ERC20, Ownable {
    uint256 public constant PRESALE_AMOUNT = 500000 * (10 ** 18); // 50% of the total supply
    uint256 public constant PRESALE_PRICE_USDT = 0.001 ether; // Price for 1 CFT in USDT
    bool public presaleSuccessful = false;
    bool public presaleEnded = false;

    // Referral rewards (percentage)
    uint256[] public referralRewards = [10, 7, 5, 3, 1]; // in percentage

    // Mappings
    mapping(address => uint256) public usdtContributions;
    mapping(address => address) public referrers;
    mapping(address => bool) public claimed;

    // Events
    event PresaleSuccessful();
    event PresaleFailed();
    event TokensClaimed(address indexed user, uint256 amount);
    event Withdrawn(address indexed admin, uint256 amount);

    constructor() ERC20("ChainForgeToken", "CFT") Ownable(msg.sender) {
        _mint(address(this), PRESALE_AMOUNT);
    }

    function setInitialOwner(address initialOwner) external onlyOwner {
        transferOwnership(initialOwner);
    }

    // Presale function
    function buyTokens(address referrer) external payable {
        require(!presaleEnded, "Presale has ended");
        require(msg.value > 0, "Must send ETH");
        require(msg.value % PRESALE_PRICE_USDT == 0, "Invalid amount");

        uint256 amountToBuy = msg.value / PRESALE_PRICE_USDT;
        require(
            balanceOf(address(this)) >= amountToBuy,
            "Not enough tokens available"
        );

        // Record contribution and referrer
        usdtContributions[msg.sender] += msg.value;
        if (referrer != address(0) && referrer != msg.sender) {
            referrers[msg.sender] = referrer;
        }

        // Distribute referral rewards
        address currentReferrer = referrers[msg.sender];
        for (
            uint256 i = 0;
            i < referralRewards.length && currentReferrer != address(0);
            i++
        ) {
            uint256 reward = (msg.value * referralRewards[i]) / 100;
            payable(currentReferrer).transfer(reward);
            currentReferrer = referrers[currentReferrer];
        }

        // Transfer tokens to user
        _transfer(address(this), msg.sender, amountToBuy);
    }

    // Admin functions
    function endPresale(bool success) external onlyOwner {
        require(!presaleEnded, "Presale already ended");
        presaleEnded = true;
        presaleSuccessful = success;
        if (success) {
            emit PresaleSuccessful();
        } else {
            emit PresaleFailed();
        }
    }

    function withdraw() external onlyOwner {
        require(presaleSuccessful, "Presale not successful");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
        emit Withdrawn(owner(), balance);
    }

    function refund() external onlyOwner {
        require(!presaleSuccessful, "Presale successful, no refunds");
        // Refund function implementation depends on your USDT handling
        // This is a placeholder for refund logic
        emit PresaleFailed();
    }

    function claimTokens() external {
        require(presaleSuccessful, "Presale not successful");
        require(!claimed[msg.sender], "Tokens already claimed");
        uint256 amount = usdtContributions[msg.sender] / PRESALE_PRICE_USDT;
        _transfer(address(this), msg.sender, amount);
        claimed[msg.sender] = true;
        emit TokensClaimed(msg.sender, amount);
    }
}
