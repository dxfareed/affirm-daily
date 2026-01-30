"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Sparkles, Flame, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { sdk } from "@farcaster/miniapp-sdk";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { DAILY_AFFIRMATION_ADDRESS, DAILY_AFFIRMATION_ABI } from "@/lib/contract";
import styles from "./AffirmationDisplay.module.css";

interface AffirmationProps {
    affirmation: string;
    isNew: boolean;
    fid: number;
}

export function AffirmationDisplay({ affirmation, isNew, fid }: AffirmationProps) {
    const today = format(new Date(), "d MMM");
    const [copied, setCopied] = useState(false);
    const [claimStatus, setClaimStatus] = useState<'idle' | 'sharing' | 'generating' | 'signing' | 'mining' | 'success'>('idle');
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

    const { address, isConnected } = useAccount();

    // Read user profile from contract
    const { data: userProfile, refetch: refetchProfile } = useReadContract({
        address: DAILY_AFFIRMATION_ADDRESS,
        abi: DAILY_AFFIRMATION_ABI,
        functionName: 'getUserProfile',
        args: [BigInt(fid)],
    });

    // Read fee from contract
    const { data: fee } = useReadContract({
        address: DAILY_AFFIRMATION_ADDRESS,
        abi: DAILY_AFFIRMATION_ABI,
        functionName: 'fee',
    });

    const { writeContractAsync } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash: txHash,
    });

    // Parse profile data
    const streak = userProfile ? Number(userProfile[0]) : 0;
    const canClaim = userProfile ? userProfile[2] : true;
    const timeUntilClaim = userProfile ? Number(userProfile[3]) : 0;

    useEffect(() => {
        if (isNew) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#06b6d4", "#ecfeff", "#ffffff"],
            });
        }
    }, [isNew]);

    useEffect(() => {
        if (isConfirmed && claimStatus !== 'success') {
            setClaimStatus('success');
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ["#06b6d4", "#fcd34d", "#ffffff"],
            });
            refetchProfile();
            // Reset after celebration
            setTimeout(() => {
                setClaimStatus('idle');
                setTxHash(undefined);
            }, 3000);
        }
    }, [isConfirmed, claimStatus, refetchProfile]);

    const handleCopy = () => {
        navigator.clipboard.writeText(affirmation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareAndClaim = async () => {
        if (!isConnected || !address || !canClaim) return;

        try {
            // Step 1: Share to Farcaster
            setClaimStatus('sharing');
            const shareText = `"${affirmation}" - My daily affirmation.`;
            const appUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
            const shareUrl = new URL(`${appUrl}/share`);
            shareUrl.searchParams.set('affirmation', affirmation);
            shareUrl.searchParams.set('date', today);

            if (!sdk?.actions?.composeCast) {
                throw new Error('Farcaster SDK not available');
            }

            const result = await sdk.actions.composeCast({
                text: shareText,
                embeds: [shareUrl.toString()],
            });

            // Check if user actually published the cast
            if (!result?.cast) {
                // User cancelled the share
                setClaimStatus('idle');
                return;
            }

            // Step 2: Generate NFT metadata
            setClaimStatus('generating');
            const signRes = await sdk.quickAuth.fetch('/api/claim/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid,
                    address,
                    affirmation,
                    streak: streak + 1,
                }),
            });

            if (!signRes.ok) {
                throw new Error('Failed to generate NFT metadata');
            }

            const { signature, deadline, tokenURI } = await signRes.json();

            // Step 3: Sign transaction
            setClaimStatus('signing');
            const hash = await writeContractAsync({
                address: DAILY_AFFIRMATION_ADDRESS,
                abi: DAILY_AFFIRMATION_ABI,
                functionName: 'claim',
                args: [BigInt(fid), address, BigInt(deadline), tokenURI, signature as `0x${string}`],
                value: fee || BigInt(0),
            });

            // Step 4: Wait for mining
            setClaimStatus('mining');
            setTxHash(hash);

        } catch (e) {
            console.error('Share & Claim error:', e);
            setClaimStatus('idle');
        }
    };

    const formatTimeRemaining = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${mins}m`;
    };

    // OG URL for preloading
    let appUrl = process.env.NEXT_PUBLIC_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    appUrl = appUrl.replace(/\/$/, '');
    const ogParams = new URLSearchParams();
    ogParams.append('affirmation', affirmation);
    ogParams.append('date', today);
    ogParams.append('v', '3');
    const ogUrl = `${appUrl}/api/og?${ogParams.toString()}`;

    const isButtonDisabled = !isConnected || !canClaim || claimStatus !== 'idle';

    const getButtonText = () => {
        if (!isConnected) return 'Connect Wallet';
        if (claimStatus === 'sharing') return 'Opening composer...';
        if (claimStatus === 'generating') return 'Creating your NFT...';
        if (claimStatus === 'signing') return 'Check your wallet...';
        if (claimStatus === 'mining') return 'Minting on Base...';
        if (claimStatus === 'success') return 'Claimed! ✅';
        if (!canClaim) return `Wait ${formatTimeRemaining(timeUntilClaim)}`;
        return 'Share & Affirm ✨';
    };

    const getStatusMessage = () => {
        switch (claimStatus) {
            case 'sharing':
                return { icon: Share2, text: 'Share your affirmation to Farcaster', color: '#06b6d4' };
            case 'generating':
                return { icon: Sparkles, text: 'Generating your unique NFT artwork', color: '#0891b2' };
            case 'signing':
                return { icon: Sparkles, text: 'Please confirm the transaction', color: '#0e7490' };
            case 'mining':
                return { icon: Loader2, text: 'Minting your affirmation on Base', color: '#155e75' };
            case 'success':
                return { icon: Sparkles, text: 'Successfully claimed!', color: '#10b981' };
            default:
                return null;
        }
    };

    const statusInfo = getStatusMessage();

    return (
        <div className={styles.container}>
            <div className="flex flex-col items-center mb-8">
                <h1 className={styles.title}>
                    Affirm Daily
                </h1>
                <p className={styles.date}>Today, {today}</p>

                {/* Streak Display */}
                {streak > 0 && (
                    <div className={styles.streak}>
                        <Flame className={styles.flameIcon} />
                        <span>{streak} day streak</span>
                    </div>
                )}
            </div>

            <div className={styles.card}>
                <blockquote className={styles.quote}>
                    "{affirmation}"
                </blockquote>

                <div className={styles.actions}>
                    <button
                        onClick={handleCopy}
                        className={styles.button}
                        title="Copy to clipboard"
                    >
                        <Copy className={`${styles.icon} ${copied ? styles.copied : ''}`} />
                    </button>
                </div>

                {/* Status Card - Shows during claim process */}
                {statusInfo && claimStatus !== 'idle' && (
                    <div className={styles.statusCard}>
                        <statusInfo.icon
                            className={`${styles.statusIcon} ${claimStatus === 'mining' || claimStatus === 'generating' ? styles.spinning : ''}`}
                            style={{ color: statusInfo.color }}
                        />
                        <p className={styles.statusText}>{statusInfo.text}</p>
                    </div>
                )}

                {/* Share & Affirm Button */}
                <button
                    onClick={handleShareAndClaim}
                    disabled={isButtonDisabled}
                    className={`${styles.affirmButton} ${isButtonDisabled ? styles.affirmButtonDisabled : ''} ${claimStatus !== 'idle' ? styles.affirmButtonLoading : ''}`}
                >
                    {claimStatus !== 'idle' && claimStatus !== 'success' && (
                        <Loader2 className={styles.buttonSpinner} />
                    )}
                    {claimStatus === 'success' && <Sparkles className={styles.sparkleIcon} />}
                    {claimStatus === 'idle' && <Sparkles className={styles.sparkleIcon} />}
                    {getButtonText()}
                </button>
            </div>

            <p className={styles.footer}>
                {canClaim ? 'Share your affirmation to claim rewards!' : `Check back in ${formatTimeRemaining(timeUntilClaim)} for a new affirmation.`}
            </p>

            {/* Hidden image to preload OG image cache */}
            <img
                src={ogUrl}
                alt=""
                width="0"
                height="0"
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                aria-hidden="true"
            />
        </div>
    );
}
