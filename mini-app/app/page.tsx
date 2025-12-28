"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { AffirmationDisplay } from "./components/AffirmationDisplay";
import { Loader2 } from "lucide-react";
import styles from "./page.module.css";

interface User {
  fid: number;
}

interface StoredAffirmation {
  text: string;
  timestamp: number;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [affirmation, setAffirmation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAffirmation = useCallback(async (fid: number) => {
    try {
      const storageKey = `affirmation_data_${fid}`;
      const stored = localStorage.getItem(storageKey);

      let shouldFetch = true;
      if (stored) {
        const parsed: StoredAffirmation = JSON.parse(stored);
        const hoursElapsed = (Date.now() - parsed.timestamp) / (1000 * 60 * 60);

        if (hoursElapsed < 24) {
          setAffirmation(parsed.text);
          shouldFetch = false;
        }
      }

      if (shouldFetch) {
        const res = await fetch("/api/affirmation");
        if (!res.ok) throw new Error("Failed to fetch affirmation");
        const data = await res.json();

        // Use 'affirmation' property from api response
        const text = data.affirmation || "You are capable of amazing things."; // Fallback

        const newData: StoredAffirmation = {
          text,
          timestamp: Date.now(),
        };
        localStorage.setItem(storageKey, JSON.stringify(newData));
        setAffirmation(text);
        setIsNew(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load your daily affirmation.");
      // Fallback if API fails and we have nothing?
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        // Wait for SDK ready ? 
        // Note: rootProvider calls sdk.actions.ready(). 
        // But we need to wait for auth.

        const res = await sdk.quickAuth.fetch("/api/me");
        if (res.ok) {
          const userData = await res.json();
          setUser({ fid: userData.fid });
          fetchAffirmation(userData.fid);
        } else {
          // Not authenticated or failed
          setError("Please open this app in Farcaster.");
          setIsLoading(false);
        }

      } catch (e) {
        console.error("Auth error", e);
        // Fallback for dev mode/browser without Farcaster context?
        // Remove this in prod, but for now:
        const demoFid = 1;
        console.warn("Using demo FID 1 due to auth failure (Dev mode?)");
        setUser({ fid: demoFid });
        fetchAffirmation(demoFid);
      }
    };

    init();
  }, [fetchAffirmation]);

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader2 className={styles.loader} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loaderContainer}>
        <p className={styles.message}>{error}</p>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      {affirmation && <AffirmationDisplay affirmation={affirmation} isNew={isNew} />}
    </main>
  );
}
