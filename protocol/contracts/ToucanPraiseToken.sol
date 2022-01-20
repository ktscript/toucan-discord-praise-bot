//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// TODO: deploy
contract ToucanPraiseToken is ERC20 {
    uint public constant _INITIAL_SUPPLY = 10000 * (10**18);
    constructor() ERC20("ToucanPraiseToken", "TPT") {
        _mint(msg.sender, _INITIAL_SUPPLY);
    }

    /**
    * @param _from the address that praises
    * @param _to the address to praise
    * @return true upon success
    *
    * Mints & sends praiseTokens to an address based on the senders balance
    */
    function praise(address _from, address _to) public returns (bool) {
        /**
         * Just making sure ppl can't praise themselves.
         */
        require(_from != _to, "Can't praise yourself");

        /**
        * It's important to think of your praiseToken balance as your reputation.
        */
        uint256 reputation = balanceOf(_from);

        /**
        * This makes the praise have a worth based on who praised.
        * If someone more reputable praises, then the praise will be worth more.
        * But I have also implement a minimum praiseWorth of 1 in case the person that praises has 0 balance.
        */
        uint256 praiseWorth;
        if (reputation < 10) {
            praiseWorth = 1;
        } else {
            praiseWorth = reputation / 10;
        }
        

        /**
        * We make sure the person that praises doesn't lose any reputation.
        * Minting more, also lowers the value of each individual token, adding an element similar to 'decaying'
        */
        _mint(_to, praiseWorth);
        return true;
    }
}