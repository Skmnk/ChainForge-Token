// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ChainForgeToken is ERC20 {
    constructor() ERC20("ChainForgeToken", "CFT") {
        // Total supply of 1,000,000 tokens with 18 decimals
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }
}
