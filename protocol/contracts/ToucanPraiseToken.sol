//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ToucanPraiseToken is ERC20 {
    uint public constant _INITIAL_SUPPLY = 10000 * (10**18);
    constructor() ERC20("ToucanPraiseToken", "TPT") {
        _mint(msg.sender, _INITIAL_SUPPLY);
    }

    /**
    * @param _to the address to praise
    * @return true upon success
    *
    * Mints & sends praiseTokens to an address
    */

    // TODO: don't allow people to praise themselves
    function praise(address _to) public returns (bool) {
        /**
        * It's important to think of your praiseToken balance as your reputation.
        */
        /**
         * TODO: this may become an issue, because, the way I've made the auth system, I believe that 
         * we will be minting/praising from a central wallet that the bot has access to as the bot has only read access to 
         * the user's wallet. With that in mind, I may need to add an extra param (the address of the praisee), which will 
         * be used to check the reputation of the person that praised.
         */
        uint256 reputation = balanceOf(msg.sender);

        /**
        * This makes the praise have a worth based on who praised.
        * If someone more reputable praises, then the praise will be worth more.
        */
        /**
         * TODO: I think if we should make sure this is a minimum of 1, 
         * so that if someone has 0 reputation he can still praise
         */
        uint256 praiseWorth = reputation / 10;

        /**
        * We make sure the person that praises doesn't lose any reputation.
        * Minting more, also lowers the value of each individual token, adding an element similar to 'decaying'
        */
        _mint(_to, praiseWorth);
        return true;
    }
}