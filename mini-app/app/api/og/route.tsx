import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { toFirstPerson } from '@/lib/affirmation';

export const runtime = 'edge';

// Cache fonts at the module level for warm starts
let cachedFonts: { turretRoad: ArrayBuffer; spaceMono: ArrayBuffer } | null = null;

async function loadFonts(appUrl: string) {
    if (cachedFonts) return cachedFonts;

    const [turretRes, spaceMonoRes] = await Promise.all([
        fetch(`${appUrl}/fonts/TurretRoad-Bold.ttf`),
        fetch(`${appUrl}/fonts/SpaceMono-Regular.ttf`),
    ]);

    cachedFonts = {
        turretRoad: await turretRes.arrayBuffer(),
        spaceMono: await spaceMonoRes.arrayBuffer(),
    };

    return cachedFonts;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const affirmation = toFirstPerson(searchParams.get('affirmation') || 'I am capable of amazing things.');
        const date = searchParams.get('date') || 'today';

        // Derive app URL from request
        let appUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || '';
        if (!appUrl) {
            const url = new URL(request.url);
            appUrl = `${url.protocol}//${url.host}`;
        } else if (!appUrl.startsWith('http')) {
            appUrl = `https://${appUrl}`;
        }

        const fonts = await loadFonts(appUrl);

        const response = new ImageResponse(
            (
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#ecfeff',
                        position: 'relative',
                    }}
                >
                    <div style={{ display: 'flex', position: 'absolute', top: '-120px', left: '-120px', width: '450px', height: '450px', borderRadius: '50%', background: '#a5f3fc' }} />
                    <div style={{ display: 'flex', position: 'absolute', bottom: '-100px', right: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: '#67e8f9' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', fontFamily: '"Turret Road"', fontSize: 80, fontWeight: 700, color: '#0891b2', letterSpacing: '-0.02em' }}>
                                Affirm Daily
                            </div>
                            <div style={{ display: 'flex', fontFamily: '"Space Mono"', fontSize: 26, color: '#0e7490', letterSpacing: '0.05em', marginTop: '8px' }}>
                                today, {date}
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255, 255, 255, 0.6)', borderRadius: '24px', padding: '45px 60px', maxWidth: '900px', boxShadow: '0 8px 32px 0 rgba(6, 182, 212, 0.15)' }}>
                            <div style={{ display: 'flex', fontFamily: '"Space Mono"', fontSize: 38, fontWeight: 500, color: '#164e63', textAlign: 'center', lineHeight: 1.6 }}>
                                &quot;{affirmation}&quot;
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    { name: 'Turret Road', data: fonts.turretRoad, style: 'normal', weight: 700 },
                    { name: 'Space Mono', data: fonts.spaceMono, style: 'normal', weight: 400 },
                ],
            },
        );

        // Aggressive caching headers
        response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
        response.headers.set('CDN-Cache-Control', 'public, max-age=86400');
        response.headers.set('Vercel-CDN-Cache-Control', 'public, max-age=86400');

        return response;
    } catch (e: any) {
        console.error(`[OG] Error: ${e.message}`);
        return new Response(`Failed: ${e.message}`, { status: 500 });
    }
}
