const ROOT_URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL;

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: process.env.NEXT_PUBLIC_HEADER,
    payload: process.env.NEXT_PUBLIC_PAYLOAD,
    signature: process.env.NEXT_PUBLIC_SIGNATURE,
  },
  "baseBuilder": {
    "allowedAddresses": [process.env.NEXT_PUBLIC_BASEBUILDER_ALLOWED_ADDRESS || ''],
  },
  frame: {
    version: "1",
    name: "Affirm Daily",
    subtitle: "Your daily dose of positivity",
    description: "Receive a new affirmation every 24 hours. Motivation, positivity, and growth.",
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/icon.png`,
    splashBackgroundColor: "#06b6d4",
    homeUrl: ROOT_URL,
    imageUrl: `${ROOT_URL}/hero.png`,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["social", "lifestyle", "affirmations"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    ogTitle: "Affirm Daily",
    ogDescription: "Receive a new affirmation every 24 hours.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Your daily dose of positivity"
  },
} as const;