// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.14;

import '@rari-capital/solmate/src/utils/CREATE3.sol';

import './interfaces/ICollector.sol';
import './Collector.sol';

/// @title CollectorDeployer
/// @dev Deployer contract for collector instances, ensures a precomputed address.
contract CollectorDeployer {
    event Deployed(address collectorAddr);

    // COLLECTOR_SALT = keccak256('io.giveth.collector-contract')
    bytes32 private constant COLLECTOR_SALT = 0x75c6784acee2c96dcc25b3d5ed873a49c07b6a9d49183ab3befda047606a3b83;

    function deploy(address beneficiaryAddr) external {
        address collector = CREATE3.deploy(COLLECTOR_SALT, type(Collector).creationCode, 0);
        ICollector(collector).initialize(beneficiaryAddr);
        emit Deployed(collector);
    }

    function getAddress() external view returns (address) {
        return CREATE3.getDeployed(COLLECTOR_SALT);
    }
}
