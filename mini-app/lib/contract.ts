import { base } from 'wagmi/chains';

export const DAILY_AFFIRMATION_ADDRESS = process.env.NEXT_PUBLIC_DAILY_AFFIRMATION_ADDRESS as `0x${string}`;

export const DAILY_AFFIRMATION_ABI = [
    {
        name: 'claim',
        type: 'function',
        stateMutability: 'payable',
        inputs: [
            { name: 'fid', type: 'uint256' },
            { name: 'recipient', type: 'address' },
            { name: 'deadline', type: 'uint256' },
            { name: 'tokenURI', type: 'string' },
            { name: 'signature', type: 'bytes' },
        ],
        outputs: [],
    },
    {
        name: 'getUserProfile',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'fid', type: 'uint256' }],
        outputs: [
            { name: 'currentStreak', type: 'uint256' },
            { name: 'lastClaimTime', type: 'uint256' },
            { name: 'canClaimNow', type: 'bool' },
            { name: 'timeUntilClaim', type: 'uint256' },
        ],
    },
    {
        name: 'fee',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const;

export const CONTRACT_CONFIG = {
    address: DAILY_AFFIRMATION_ADDRESS,
    abi: DAILY_AFFIRMATION_ABI,
    chainId: base.id,
};
