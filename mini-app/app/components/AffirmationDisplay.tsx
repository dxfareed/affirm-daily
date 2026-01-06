"use client";

import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import confetti from "canvas-confetti";
import { format } from "date-fns";
import { sdk } from "@farcaster/miniapp-sdk";
import styles from "./AffirmationDisplay.module.css";

interface AffirmationProps {
    affirmation: string;
    isNew: boolean;
}

export function AffirmationDisplay({ affirmation, isNew }: AffirmationProps) {
    const today = format(new Date(), "d MMM");
    const [copied, setCopied] = useState(false);

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

    const handleCopy = () => {
        navigator.clipboard.writeText(affirmation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const shareText = `"${affirmation}" - My daily affirmation.`;

        // Construct share URL using env var or fallback to origin
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

    // Construct OG URL for preloading (use URLSearchParams to match server encoding and ensure cache hit)
    const appUrl = process.env.NEXT_PUBLIC_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const ogParams = new URLSearchParams();
    ogParams.append('affirmation', affirmation);
    ogParams.append('date', today);
    ogParams.append('v', '2');
    const ogUrl = `${appUrl}/api/og?${ogParams.toString()}`;

    return (
        <div className={styles.container}>
            <div className="flex flex-col items-center mb-8">
                <h1 className={styles.title}>
                    Affirm Daily
                </h1>
                <p className={styles.date}>Today, {today}</p>
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
            </div>

            <p className={styles.footer}>
                Check back in 24 hours for a new affirmation.
            </p>

            {/* Hidden image to preload/warm the OG image cache */}
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
