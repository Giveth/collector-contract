// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.14;

/// Must be called by the owner address.
error OnlyOwner();

/// Must not be zero address.
error NoAddressZero();

/// Must not be initialzied.
error MustNotInitialized();

/// @title OwnableInitializable
/// @author Giveth developers
/// @dev Add an owner to the contract that is set by the initializer function
abstract contract OwnableInitializable {
    bool internal _initialized;
    address internal _owner;

    /// @dev Emit when the ownership is transferred to a new address.
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @dev Revert if initialized
    modifier onlyNotInitialized() {
        if (_initialized) {
            revert MustNotInitialized();
        }
        _;
    }

    /// @dev Revert if not called by the owner address.
    modifier onlyOwner() {
        if (msg.sender != _owner) {
            revert OnlyOwner();
        }
        _;
    }

    /// @dev Returns the initialized flag.abi
    /// @return True if initialized.
    function initalized() external view returns (bool) {
        return _initialized;
    }

    /// @dev Returns the address of the current owner.
    /// @return Current owner
    function owner() external view returns (address) {
        return _owner;
    }

    /// @dev Explicitly renounce ownership of the contract.
    /// Can only be called by the current owner.
    ///
    /// NOTE: this will leave the contract without an owner, thus removing any fucntionality that is only available to
    /// the owner!
    function renounceOnwership() external onlyOwner {
        _transferOwnership(address(0));
    }

    /// @dev Transfer the ownership to a new address.
    /// Can only be called by the current owner.
    function transferOwnership(address newOwnerAddr) external onlyOwner {
        if (newOwnerAddr == address(0)) {
            revert NoAddressZero();
        }
        _transferOwnership(newOwnerAddr);
    }

    /// @dev Ownable initialization. This should be called immediately after creation.
    /// Internal function, does not emit initialized event.
    /// The contract cannot be initialized more than once.
    /// @param ownerAddr Explicit owner address, address zero for no owner.
    function __initialize_Ownable(address ownerAddr) internal onlyNotInitialized {
        _transferOwnership(ownerAddr);
        _initialized = true;
    }

    /// @dev Transfer ownership to a new address.
    /// Internal function with no access restriction.
    function _transferOwnership(address newOwnerAddr) internal {
        address oldOwner = _owner;
        _owner = newOwnerAddr;
        emit OwnershipTransferred(oldOwner, newOwnerAddr);
    }
}
