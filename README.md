# Affirm Daily 🌟

A Farcaster Mini App that delivers daily affirmations to inspire and motivate you. Built with Next.js and designed with a beautiful cyan glassmorphism aesthetic.

## 📖 Overview

Affirm Daily is a simple yet powerful mini-app that:
- Delivers a **new affirmation every 24 hours**
- Caches your daily affirmation locally (per user FID)
- Features a stunning **liquid glass UI** with custom typography
- Allows **sharing to Farcaster** with beautiful OG images
- Celebrates new affirmations with **confetti animations** 🎉

## 📁 Project Structure

```
affirm-daily/
├── mini-app/          # Next.js Farcaster Mini App
│   ├── app/
│   │   ├── api/
│   │   │   ├── affirmation/   # Proxy to affirmations.dev
│   │   │   ├── me/            # Farcaster Quick Auth endpoint
│   │   │   └── og/            # Dynamic OG image generation
│   │   ├── share/             # Frame share page with metadata
│   │   ├── components/        # React components
│   │   └── context/           # React contexts
│   ├── lib/                   # Utilities (auth, wagmi config)
│   ├── public/                # Static assets & fonts
│   └── minikit.config.ts      # Farcaster Mini App configuration
│
└── contracts/         # Smart Contracts (Hardhat)
    ├── contracts/
    │   ├── DailyGiftXmas.sol  # Daily gift claiming contract
    │   ├── FamilyTree.sol     # Family tree NFT contract
    │   └── Xmas.sol           # Christmas token contract
    └── scripts/               # Deployment & utility scripts
```

## � Smart Contract Features (`DailyAffirmation.sol`)

- **Daily Claims:** Enforces one claim per 24 hours per FID.
- **Bot Prevention:** Requires `0.0000030 ETH` fee + Backend Signature verification.
- **Rewards:**
    - **ERC721 NFT:** Dynamic SVG image of the affirmation (stored securely on Pinata).
    - **ERC20 Token:** Reward tokens sent directly to user wallet.
- **Admin:** Fee management and emergency rescue functions.

## �🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Farcaster account (for testing in Warpcast)

### Mini App Setup

1. **Navigate to the mini-app directory:**
   ```bash
   cd mini-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file:
   ```env
   # Required for wallet connection
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   
   # Your deployed app URL (for OG images & sharing)
   NEXT_PUBLIC_URL=https://your-app-url.com
   
   # Farcaster Mini App Account Association (from Warpcast dev tools)
   NEXT_PUBLIC_HEADER=your_header
   NEXT_PUBLIC_PAYLOAD=your_payload
   NEXT_PUBLIC_SIGNATURE=your_signature

   # Backend Signer & Pinata (For Daily Affirmation NFT)
   NEXT_PUBLIC_DAILY_AFFIRMATION_ADDRESS=0x...
   SIGNER_PRIVATE_KEY=your_private_key
   PINATA_API_KEY=your_key
   PINATA_SECRET_API_KEY=your_secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **For local testing with Farcaster:**
   Use a tunneling service like Cloudflare Tunnel:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
   Then update `NEXT_PUBLIC_URL` with the tunnel URL.

### Smart Contracts Setup

1. **Navigate to contracts directory:**
   ```bash
   cd contracts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Hardhat:**
   Update `hardhat.config.ts` with your network settings and private key.

4. **Compile contracts:**
   ```bash
   npx hardhat compile
   ```

5. **Deploy:**
   ```bash
   npx hardhat run scripts/deployDailyAffirmation.ts --network base
   ```

## ⚙️ How It Works

### Authentication Flow
1. User opens the mini-app in Warpcast
2. App calls `sdk.actions.ready()` to initialize
3. Uses `sdk.quickAuth.fetch('/api/me')` for authentication
4. Returns user's FID (Farcaster ID)

### Affirmation Logic
1. On auth success, checks `localStorage` for cached affirmation
2. Cache key: `affirmation_data_{fid}`
3. If cache is older than 24 hours → fetch new affirmation
4. New affirmations trigger confetti celebration!
5. Affirmations are fetched via `/api/affirmation` (proxies affirmations.dev)

### Sharing Flow
1. User clicks share button
2. App calls `sdk.actions.composeCast()` with:
   - Cast text: `"[affirmation]" - My daily affirmation.`
   - Embed: Link to `/share?affirmation=...`
3. Share page generates Frame metadata with:
   - Dynamic OG image from `/api/og`
   - Interactive "Open Affirm Daily" button
4. When posted, the Frame shows the beautiful affirmation card

### Claiming Flow (NFT + Tokens)
1. **Auth:** User authenticates via Farcaster Quick Auth.
2. **Request:** Frontend sends data to `/api/claim/signature`.
3. **Backend Logic:**
   - Verifies Farcaster Session.
   - Generates an **SVG image** of the affirmation.
   - Uploads Image & Metadata to **Pinata** (IPFS).
   - Signs the data (`fid`, `recipient`, `deadline`, `tokenURI`) with `SIGNER_PRIVATE_KEY`.
4. **On-Chain:** User calls `claim(...)` on `DailyAffirmation.sol` with the signature and fee.
5. **Result:** User receives the NFT and Reward Tokens.

## 🎨 Design System

### Colors (Cyan Theme)
| Variable | Hex | Usage |
|----------|-----|-------|
| `--background` | `#ecfeff` | Page background (Cyan-50) |
| `--foreground` | `#164e63` | Primary text (Cyan-900) |
| `--accent` | `#06b6d4` | Buttons, highlights (Cyan-500) |

### Typography
- **Headings:** Turret Road (Bold)
- **Body:** Space Mono (Regular)

### Glass Effect
```css
background: rgba(255, 255, 255, 0.25);
backdrop-filter: blur(16px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.6);
box-shadow: 0 8px 32px 0 rgba(6, 182, 212, 0.15);
border-radius: 24px;
```

## 📱 Farcaster Integration

### Required SDK Methods
- `sdk.actions.ready()` - Initialize the mini-app
- `sdk.quickAuth.fetch()` - Authenticated API calls
- `sdk.actions.composeCast()` - Share to Farcaster
- `sdk.haptics.impactOccurred()` - Haptic feedback (optional)

### Frame Metadata Structure
```json
{
  "version": "1",
  "imageUrl": "https://your-app/api/og?affirmation=...",
  "button": {
    "title": "Open Affirm Daily",
    "action": {
      "name": "Launch Affirm Daily",
      "type": "launch_frame",
      "url": "https://your-app",
      "splashImageUrl": "https://your-app/icon.png",
      "splashBackgroundColor": "#06b6d4"
    }
  }
}
```

## 🛠️ Tech Stack

### Mini App
- **Framework:** Next.js 15 (App Router)
- **Styling:** CSS Modules
- **Auth:** Farcaster Quick Auth
- **Wallet:** Wagmi + RainbowKit
- **OG Images:** `next/og` (Satori)
- **Animations:** canvas-confetti

### Contracts
- **Framework:** Hardhat
- **Language:** Solidity
- **Network:** Base

## 📄 License

MIT License - Feel free to use and modify!

---

Built with ❤️ by [@dxfareed](https://warpcast.com/dxfareed)
