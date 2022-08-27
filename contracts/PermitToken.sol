// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract PermitToken is ERC20Permit {
    constructor(uint supply) ERC20Permit("PermitToken") ERC20("PermitToken", "PMT") {
        _mint(msg.sender, supply);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
