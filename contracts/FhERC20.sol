// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { FHE, euint16, inEuint16 } from "@fhenixprotocol/contracts/FHE.sol";
import { Permissioned, Permission } from "@fhenixprotocol/contracts/access/Permissioned.sol";
import { IFHERC20 } from "./interfaces/IFHERC20.sol";

error ErrorInsufficientFunds();
error ERC20InvalidApprover(address);
error ERC20InvalidSpender(address);

/// @author Fhenix
contract FHERC20 is IFHERC20, ERC20, Permissioned {

    // A mapping from address to an encrypted balance.
    mapping(address => euint16) internal _encBalances;
    // A mapping from address (owner) to a mapping of address (spender) to an encrypted amount.
    mapping(address => mapping(address => euint16)) private _allowed;
    euint16 internal totalEncryptedSupply = FHE.asEuint16(0);

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {}

    function _allowanceEncrypted(address owner, address spender) public view virtual returns (euint16) {
        return _allowed[owner][spender];
    }
    function allowanceEncrypted(
        address spender,
        Permission calldata permission
    ) public view virtual onlySender(permission) returns (bytes memory) {
        return FHE.sealoutput(_allowanceEncrypted(msg.sender, spender), permission.publicKey);
    }

    function approveEncrypted(address spender, inEuint16 calldata value) public virtual returns (bool) {
        _approve(msg.sender, spender, FHE.asEuint16(value));
        return true;
    }

    function _approve(address owner, address spender, euint16 value) internal {
        if (owner == address(0)) {
            revert ERC20InvalidApprover(address(0));
        }
        if (spender == address(0)) {
            revert ERC20InvalidSpender(address(0));
        }
        _allowed[owner][spender] = value;
    }

    function _spendAllowance(address owner, address spender, euint16 value) internal virtual returns (euint16) {
        euint16 currentAllowance = _allowanceEncrypted(owner, spender);
        euint16 spent = FHE.min(currentAllowance, value);
        _approve(owner, spender, (currentAllowance - spent));

        return spent;
    }

    function transferFromEncrypted(address from, address to, euint16 value) public virtual returns (euint16) {
        euint16 val = value;
        euint16 spent = _spendAllowance(from, msg.sender, val);
        _transferImpl(from, to, spent);
        return spent;
    }

    function transferFromEncrypted(address from, address to, inEuint16 calldata value) public virtual returns (euint16) {
        euint16 val = FHE.asEuint16(value);
        euint16 spent = _spendAllowance(from, msg.sender, val);
        _transferImpl(from, to, spent);
        return spent;
    }

    function wrap(uint16 amount) public {
        if (balanceOf(msg.sender) < amount) {
            revert ErrorInsufficientFunds();
        }

        _burn(msg.sender, amount);
        euint16 eAmount = FHE.asEuint16(amount);
        _encBalances[msg.sender] = _encBalances[msg.sender] + eAmount;
        totalEncryptedSupply = totalEncryptedSupply + eAmount;
    }

    function unwrap(uint16 amount) public {
        euint16 encAmount = FHE.asEuint16(amount);

        euint16 amountToUnwrap = FHE.select(_encBalances[msg.sender].gt(encAmount), FHE.asEuint16(0), encAmount);

        _encBalances[msg.sender] = _encBalances[msg.sender] - amountToUnwrap;
        totalEncryptedSupply = totalEncryptedSupply - amountToUnwrap;

        _mint(msg.sender, FHE.decrypt(amountToUnwrap));
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function mintEncrypted(inEuint16 calldata encryptedAmount) public {
        euint16 amount = FHE.asEuint16(encryptedAmount);
        _encBalances[msg.sender] = _encBalances[msg.sender] + amount;
        totalEncryptedSupply = totalEncryptedSupply + amount;
    }

    function burnEncrypted(inEuint16 calldata encryptedAmount) public {
        euint16 amount = FHE.asEuint16(encryptedAmount);
        _encBalances[msg.sender] = _encBalances[msg.sender] - amount;
        totalEncryptedSupply = totalEncryptedSupply - amount;

    }

    function mintEncryptedTo(address to, euint16 encryptedAmount) public {
        _encBalances[to] = _encBalances[to] + encryptedAmount;
        totalEncryptedSupply = totalEncryptedSupply + encryptedAmount;
    }

    
    function burnEncryptedTo(address to, euint16 encryptedAmount) public {
        _encBalances[to] = _encBalances[to] - encryptedAmount;
        totalEncryptedSupply = totalEncryptedSupply - encryptedAmount;

    }

    function transferEncrypted(address to, inEuint16 calldata encryptedAmount) public returns (euint16) {
        return transferEncrypted(to, FHE.asEuint16(encryptedAmount));
    }

    // Transfers an amount from the message sender address to the `to` address.
    function transferEncrypted(address to, euint16 amount) public returns (euint16) {
        return _transferImpl(msg.sender, to, amount);
    }

    // Transfers an encrypted amount.
    function _transferImpl(address from, address to, euint16 amount) internal returns (euint16) {
        // Make sure the sender has enough tokens.
        euint16 amountToSend = FHE.select(amount.lte(_encBalances[from]), amount, FHE.asEuint16(0));

        // Add to the balance of `to` and subract from the balance of `from`.
        _encBalances[to] = _encBalances[to] + amountToSend;
        _encBalances[from] = _encBalances[from] - amountToSend;

        return amountToSend;
    }

    function balanceOfSealed(
        address account, Permission memory auth
    ) virtual public view onlyPermitted(auth, account) returns (bytes memory) {
        return _encBalances[msg.sender].seal(auth.publicKey);
    }

// TEST PURPORSES 
    function balanceOfEncrypted(address account) virtual external view returns (uint16) {
        return FHE.decrypt(_encBalances[account]);
    }

    //    // Returns the total supply of tokens, sealed and encrypted for the caller.
    //    // todo: add a permission check for total supply readers
    //    function getEncryptedTotalSupply(
    //        Permission calldata permission
    //    ) public view onlySender(permission) returns (bytes memory) {
    //        return totalEncryptedSupply.seal(permission.publicKey);
    //    }
}