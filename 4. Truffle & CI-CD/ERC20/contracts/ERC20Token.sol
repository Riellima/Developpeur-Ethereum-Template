 // SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20{
    constructor (uint _initialSupply) ERC20("ALYRA", "ALY"){
        _mint(msg.sender, _initialSupply);
    }
}