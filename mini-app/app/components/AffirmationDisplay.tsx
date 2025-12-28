"use client";

import { useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";
import confetti from "canvas-confetti";
import styles from "./AffirmationDisplay.module.css";

interface AffirmationProps {
    affirmation: string;
    isNew: boolean;
}

export function AffirmationDisplay({ affirmation, isNew }: AffirmationProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isNew) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ["#8b5cf6", "#e2e8f0", "#ffffff"],
            });
        }
    }, [isNew]);

    const handleCopy = () => {
        navigator.clipboard.writeText(affirmation);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "Affirm Daily",
                text: `"${affirmation}" - My daily affirmation.`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            handleCopy();
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                Affirm Daily
            </h1>

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
        </div>
    );
}
