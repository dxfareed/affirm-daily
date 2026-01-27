"use client";

import { useEffect, useState } from "react";
import { Copy, Share2, Sparkles, Flame } from "lucide-react";
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
    const [isAffirming, setIsAffirming] = useState(false);

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

    const { writeContract, data: txHash, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
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
        if (isSuccess) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.5 },
                colors: ["#06b6d4", "#fcd34d", "#ffffff"],
            });
            refetchProfile();
            setIsAffirming(false);
        }
    }, [isSuccess, refetchProfile]);

    const handleCopy = () => {
        navigator.clipboard.writeText(affirmation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const shareText = `"${affirmation}" - My daily affirmation.`;
        const appUrl = process.env.NEXT_PUBLIC_URL || window.location.origin;
        const shareUrl = new URL(`${appUrl}/share`);
        shareUrl.searchParams.set('affirmation', affirmation);
        shareUrl.searchParams.set('date', today);

        if (sdk && sdk.actions && sdk.actions.composeCast) {
            try {
                sdk.actions.composeCast({
                    text: shareText,
                    embeds: [shareUrl.toString()],
                });
            } catch (e) {
                console.error("Error sharing:", e);
            }
        }
    };

    const handleAffirm = async () => {
        if (!isConnected || !address || !canClaim) return;

        setIsAffirming(true);
        try {
            // Get signature from backend
            const signRes = await sdk.quickAuth.fetch('/api/claim/signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid,
                    address,
                    tokenURI: `ipfs://affirm-daily/${fid}/${Date.now()}`, // Placeholder
                }),
            });

            if (!signRes.ok) {
                throw new Error('Failed to get signature');
            }

            const { signature, deadline, tokenURI } = await signRes.json();

            // Call contract
            writeContract({
                address: DAILY_AFFIRMATION_ADDRESS,
                abi: DAILY_AFFIRMATION_ABI,
                functionName: 'claim',
                args: [BigInt(fid), address, BigInt(deadline), tokenURI, signature as `0x${string}`],
                value: fee || BigInt(0),
            });
        } catch (e) {
            console.error('Affirm error:', e);
            setIsAffirming(false);
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

    const isButtonDisabled = !isConnected || !canClaim || isPending || isConfirming || isAffirming;

    const getButtonText = () => {
        if (!isConnected) return 'Connect Wallet';
        if (isPending || isConfirming || isAffirming) return 'Affirming...';
        if (!canClaim) return `Wait ${formatTimeRemaining(timeUntilClaim)}`;
        return 'Affirm ✨';
    };

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

                    <button
                        onClick={handleShare}
                        className={styles.button}
                        title="Share"
                    >
                        <Share2 className={styles.icon} />
                    </button>
                </div>

                {/* Affirm Button */}
                <button
                    onClick={handleAffirm}
                    disabled={isButtonDisabled}
                    className={`${styles.affirmButton} ${isButtonDisabled ? styles.affirmButtonDisabled : ''}`}
                >
                    <Sparkles className={styles.sparkleIcon} />
                    {getButtonText()}
                </button>
            </div>

            <p className={styles.footer}>
                {canClaim ? 'Affirm daily to build your streak!' : `Check back in ${formatTimeRemaining(timeUntilClaim)} for a new affirmation.`}
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
