import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { format } from 'date-fns';
import { isAuthenticated } from '@/lib/auth';
import { generateAffirmationSVG, uploadToPinata } from '@/lib/pinata';

const PRIVATE_KEY = process.env.SERVER_SIGNER_PRIVATE_KEY!;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_DAILY_AFFIRMATION_ADDRESS!;

export async function POST(req: NextRequest) {
    // 1. Verify User Session via Farcaster Quick Auth
    const authResult = await isAuthenticated(req);
    if (typeof authResult !== 'number') {
        return authResult; // Returns 401/500 NextResponse
    }
    const authenticatedFid = authResult;

    const body = await req.json();
    const { fid, address, affirmation, streak } = body;

    if (!fid || !address || !affirmation) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (Number(fid) !== authenticatedFid) {
        return NextResponse.json({ error: 'FID mismatch' }, { status: 403 });
    }

    try {
        // 2. Generate NFT Image & Metadata
        const date = format(new Date(), 'd MMM yyyy');
        const svg = generateAffirmationSVG(affirmation, date, streak || 0);

        const { metadataUri } = await uploadToPinata(
            svg,
            {
                affirmation,
                date,
                streak: streak || 0,
            },
            fid
        );

        const tokenURI = metadataUri;

        // 3. Prepare Signature Data
        const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes exp
        const chainId = 8453;

        // 4. Hash Message
        const hash = ethers.solidityPackedKeccak256(
            ['uint256', 'address', 'uint256', 'string', 'uint256', 'address'],
            [fid, address, deadline, tokenURI, chainId, CONTRACT_ADDRESS]
        );

        // 5. Sign Message
        const wallet = new ethers.Wallet(PRIVATE_KEY);
        const signature = await wallet.signMessage(ethers.getBytes(hash));

        return NextResponse.json({
            signature,
            deadline,
            tokenURI,
            contractAddress: CONTRACT_ADDRESS
        });
    } catch (error) {
        console.error('[Claim Signature] Error:', error);
        return NextResponse.json({ error: 'Failed to generate NFT metadata' }, { status: 500 });
    }
}
