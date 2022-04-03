//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {

    constructor (uint _initialSupply) ERC20 ('ALYRATOK', 'ALY'){
        // /!\ initial supply in tokenBits ie for 100 token => supply = 100 * 10^18 (if 18 decimals)
        _mint(msg.sender, _initialSupply) ;
    }
}