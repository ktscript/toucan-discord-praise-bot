//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ToucanPraiseToken is ERC20 {
    uint public constant _INITIAL_SUPPLY = 10000 * (10**18);
    constructor() ERC20("ToucanPraiseToken", "TPT") {
        _mint(msg.sender, _INITIAL_SUPPLY);
    }
}