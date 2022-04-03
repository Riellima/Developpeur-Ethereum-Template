//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.13;

import "./ERC20Token.sol";

contract Crowdsale {
    uint public rate = 200; // conversion rate ie 1 eth <=> 200 token
    ERC20Token public token;

    constructor(uint _initialSupply) {
        // /!\ initial supply in tokenBits ie for 100 token => supply = 100 * 10^18 (if 18 decimals)
        token = new ERC20Token(_initialSupply);
    }

    receive() external payable{
        require(msg.value >= 0.01 ether, "Can't send less than 0.01 eth");
        distribute(msg.value);
    }

    function distribute(uint _amount) internal {
        token.transfer(msg.sender, _amount * rate);
    }
}