import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { TURRET_ROAD_BOLD_BASE64, SPACE_MONO_REGULAR_BASE64 } from './fonts';

export const runtime = 'edge';

function toArrayBuffer(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const turretRoadFontData = toArrayBuffer(TURRET_ROAD_BOLD_BASE64);
const spaceMonoFontData = toArrayBuffer(SPACE_MONO_REGULAR_BASE64);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const affirmation = searchParams.get('affirmation') || 'You are capable of amazing things.';
        const date = searchParams.get('date') || 'today';

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
                    { name: 'Turret Road', data: turretRoadFontData, style: 'normal', weight: 700 },
                    { name: 'Space Mono', data: spaceMonoFontData, style: 'normal', weight: 400 },
                ],
            },
        );

        // Add aggressive caching headers (Option 2)
        response.headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');
        response.headers.set('CDN-Cache-Control', 'public, max-age=86400');
        response.headers.set('Vercel-CDN-Cache-Control', 'public, max-age=86400');

        return response;
    } catch (e: any) {
        console.error(`[OG] Error: ${e.message}`);
        return new Response(`Failed: ${e.message}`, { status: 500 });
    }
}
