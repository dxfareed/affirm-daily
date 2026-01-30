import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new PinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_API_KEY!
);

/**
 * Generate an SVG image for the affirmation NFT
 */
export function generateAffirmationSVG(affirmation: string, date: string, streak: number): string {
  // Escape special characters for XML
  const escapedAffirmation = affirmation
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  return `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ecfeff"/>
      <stop offset="100%" style="stop-color:#a5f3fc"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0891b2"/>
      <stop offset="100%" style="stop-color:#06b6d4"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="600" height="600" fill="url(#bg)"/>
  
  <!-- Decorative circles -->
  <circle cx="-50" cy="-50" r="200" fill="#67e8f9" opacity="0.5"/>
  <circle cx="650" cy="650" r="180" fill="#a5f3fc" opacity="0.6"/>
  
  <!-- Card -->
  <rect x="50" y="120" width="500" height="360" rx="24" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
  
  <!-- Title -->
  <text x="300" y="80" text-anchor="middle" font-family="system-ui, sans-serif" font-size="36" font-weight="bold" fill="url(#accent)">Affirm Daily</text>
  
  <!-- Date -->
  <text x="300" y="170" text-anchor="middle" font-family="monospace" font-size="16" fill="#0e7490">${date}</text>
  
  <!-- Affirmation Text (wrapped) -->
  <foreignObject x="70" y="200" width="460" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;text-align:center;font-family:monospace;font-size:20px;color:#164e63;line-height:1.5;padding:10px;">
      "${escapedAffirmation}"
    </div>
  </foreignObject>
  
  <!-- Streak Badge -->
  ${streak > 0 ? `
  <rect x="230" y="420" width="140" height="36" rx="18" fill="rgba(251,146,60,0.2)" stroke="rgba(251,146,60,0.5)" stroke-width="1"/>
  <text x="300" y="445" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#ea580c">🔥 ${streak} day streak</text>
  ` : ''}
  
  <!-- Footer -->
  <text x="300" y="560" text-anchor="middle" font-family="monospace" font-size="12" fill="#0e7490" opacity="0.7">affirm-daily.vercel.app</text>
</svg>`;
}

/**
 * Upload content to Pinata IPFS
 */
export async function uploadToPinata(
  svgContent: string,
  metadata: object,
  fid: number
): Promise<{ imageUri: string; metadataUri: string }> {
  const timestamp = Date.now();

  // Upload SVG image as file (not JSON) for proper rendering
  const stream = Readable.from([svgContent]);
  // @ts-ignore - Add path for Pinata to detect file type
  stream.path = `affirmation-${fid}-${timestamp}.svg`;

  const imageResult = await pinata.pinFileToIPFS(
    stream,
    {
      pinataMetadata: { name: `affirm-daily-${fid}-${timestamp}-image.svg` }
    }
  );
  const imageUri = `ipfs://${imageResult.IpfsHash}`;

  // Create and upload metadata
  const nftMetadata = {
    name: `Affirm Daily #${fid}-${timestamp}`,
    description: "A daily affirmation NFT from Affirm Daily",
    image: imageUri,
    ...metadata,
    attributes: [
      { trait_type: "Type", value: "Daily Affirmation" },
      { trait_type: "FID", value: fid },
      ...(metadata as any).attributes || []
    ]
  };

  const metadataResult = await pinata.pinJSONToIPFS(nftMetadata, {
    pinataMetadata: { name: `affirm-daily-${fid}-${timestamp}-metadata` }
  });

  return {
    imageUri,
    metadataUri: `ipfs://${metadataResult.IpfsHash}`
  };
}
