// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DailyAffirmation
 * @notice Combines daily ERC20 rewards with an NFT mint of the affirmation.
 * Enforces a small ETH fee and backend signature verification (FID-based) to prevent bots.
 */
contract DailyAffirmation is ERC721URIStorage, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;
    using SafeERC20 for IERC20;

    // --- State Variables ---

    uint256 private _nextTokenId;

    // Configuration
    IERC20 public rewardToken;
    address public signer;
    uint256 public rewardAmount;
    uint256 public fee; // Anti-bot fee (e.g., 0.0000030 ether)
    uint256 public claimInterval = 24 hours;

    // FID => last claim timestamp
    mapping(uint256 => uint256) public lastClaim;
    
    // Track used signatures to prevent replay attacks
    mapping(bytes32 => bool) public usedSignatures;

    // --- Events ---

    event Claimed(uint256 indexed fid, address indexed recipient, uint256 amount, uint256 tokenId);
    event ConfigUpdated(string param, uint256 newValue);
    event ConfigUpdatedAddress(string param, address newValue);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    // --- Errors ---

    error InvalidSigner();
    error InvalidRecipient();
    error InvalidSignature();
    error SignatureExpired();
    error SignatureAlreadyUsed();
    error ClaimTooSoon(uint256 timeRemaining);
    error IncorrectFee();
    error ZeroAddress();
    error ZeroAmount();

    constructor(
        address _rewardToken,
        address _signer,
        uint256 _rewardAmount,
        uint256 _fee
    ) ERC721("Affirm Daily", "AFFIRM") Ownable(msg.sender) {
        if (_rewardToken == address(0)) revert ZeroAddress();
        if (_signer == address(0)) revert ZeroAddress();
        
        rewardToken = IERC20(_rewardToken);
        signer = _signer;
        rewardAmount = _rewardAmount;
        fee = _fee;
    }

    /**
     * @notice Claim the daily reward and mint the affirmation NFT.
     * @param fid The Farcaster ID of the user.
     * @param recipient The address to receive the token and NFT.
     * @param deadline The timestamp when the signature expires.
     * @param tokenURI The metadata URI for the affirmation NFT.
     * @param signature The backend signature verifying eligibility.
     */
    function claim(
        uint256 fid,
        address recipient,
        uint256 deadline,
        string calldata tokenURI,
        bytes calldata signature
    ) external payable nonReentrant {
        if (msg.value != fee) revert IncorrectFee();
        if (recipient == address(0)) revert InvalidRecipient();
        if (block.timestamp > deadline) revert SignatureExpired();

        // 1. Verify Daily Limit
        uint256 lastClaimTime = lastClaim[fid];
        if (block.timestamp < lastClaimTime + claimInterval) {
            revert ClaimTooSoon(lastClaimTime + claimInterval - block.timestamp);
        }

        // 2. Verify Signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                fid,
                recipient,
                deadline,
                tokenURI,
                block.chainid,
                address(this)
            )
        );

        if (usedSignatures[messageHash]) revert SignatureAlreadyUsed();

        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        address recoveredSigner = ethSignedHash.recover(signature);
        if (recoveredSigner != signer) revert InvalidSignature();

        // 3. Update State
        usedSignatures[messageHash] = true;
        lastClaim[fid] = block.timestamp;
        uint256 tokenId = _nextTokenId++;

        // 4. Execute Actions
        // Mint NFT
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Send Reward Tokens
        if (rewardAmount > 0) {
            rewardToken.safeTransfer(recipient, rewardAmount);
        }

        emit Claimed(fid, recipient, rewardAmount, tokenId);
    }

    // --- View Functions ---

    function canClaim(uint256 fid) external view returns (bool) {
        return block.timestamp >= lastClaim[fid] + claimInterval;
    }

    function timeUntilNextClaim(uint256 fid) external view returns (uint256) {
        uint256 nextClaimTime = lastClaim[fid] + claimInterval;
        if (block.timestamp >= nextClaimTime) return 0;
        return nextClaimTime - block.timestamp;
    }

    // --- Admin Functions ---

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
        emit ConfigUpdated("fee", _fee);
    }

    function setRewardAmount(uint256 _amount) external onlyOwner {
        rewardAmount = _amount;
        emit ConfigUpdated("rewardAmount", _amount);
    }

    function setClaimInterval(uint256 _interval) external onlyOwner {
        claimInterval = _interval;
        emit ConfigUpdated("claimInterval", _interval);
    }

    function setSigner(address _signer) external onlyOwner {
        if (_signer == address(0)) revert ZeroAddress();
        signer = _signer;
        emit ConfigUpdatedAddress("signer", _signer);
    }

    function setRewardToken(address _token) external onlyOwner {
        if (_token == address(0)) revert ZeroAddress();
        rewardToken = IERC20(_token);
        emit ConfigUpdatedAddress("rewardToken", _token);
    }

    /**
     * @notice Withdraw collected ETH fees.
     */
    function withdrawEther() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @notice Rescue or withdraw reward tokens.
     */
    function withdrawTokens(address _token, uint256 amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), amount);
        emit EmergencyWithdraw(_token, amount);
    }
}
