// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RugDrop is Ownable {

    error ArraysDontMatch();
    error ZeroAmount();
    error ZeroLength();

    constructor() Ownable(msg.sender) { }

    /// @dev Airdrop multiple addresses the same amount
    /// @param _recipients array list of receiving addresses
    /// @param _amount amount to send
    /// @param _token the address of the ERC-20 token that is being sent out
    function airdrop(address[] calldata _recipients, uint _amount, address _token) external {
        if(_amount <= 0) { revert ZeroAmount(); }
        uint256 address_length = _recipients.length;
        if(address_length < 1) { revert ZeroLength();}

        /// Not checking overflow, be cautious of array size, if txs fails try spliting into multiple calls
        for(uint i; i < address_length;) {
            IERC20(_token).transferFrom(msg.sender, _recipients[i], _amount);
            unchecked { i++; }
        }
    }

    /// @dev Airdrop multiple addresses different amounts
    /// @notice _recipients[0] will receive _amounts[0] and so on, ensure they line up
    /// @param _recipients array list of receiving addresses
    /// @param _amounts array list of amounts to send, order must match _recipients array
    /// @param _token the address of the ERC-20 token that is being sent out
    function airdropMulti(address[] calldata _recipients, uint[] calldata _amounts, address _token) external {
        uint256 address_length = _recipients.length;
        uint256 amount_length = _amounts.length;
        if(address_length != amount_length) { revert ArraysDontMatch(); }
        if(address_length < 1) { revert ZeroLength();}

        /// Not checking overflow, be cautious of array size, if txs fails try spliting into multiple calls
        for(uint i; i < address_length;) {
            IERC20(_token).transferFrom(msg.sender, _recipients[i], _amounts[i]);
            unchecked { i++; }
        }
    }

    function withdrawERC20Donations(address _token) external onlyOwner {
        IERC20(_token).transfer(owner(), IERC20(_token).balanceOf(address(this)));
    }
    
    function withdrawGasDonations() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}