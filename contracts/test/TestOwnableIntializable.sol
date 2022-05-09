// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.14;

import '../lib/OwnableInitializable.sol';

contract TestOwnableInitializable is OwnableInitializable {
    constructor() {}

    function initalize(address ownerAddr) public {
        __initialize_Ownable(ownerAddr);
    }
}
