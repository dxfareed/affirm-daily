import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const affirmation = searchParams.get('affirmation') || 'You are capable of amazing things.';
        const date = searchParams.get('date') || 'today';

        console.log('[OG] Generating styled image for:', affirmation, date);

        // Load custom fonts from public directory
        let appUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || 'http://localhost:3000';
        if (!appUrl.startsWith('http')) {
            appUrl = `https://${appUrl}`;
        }

        const [turretRoadBold, spaceMonoRegular] = await Promise.all([
            fetch(new URL(`${appUrl}/Space_Mono,Turret_Road/Turret_Road/TurretRoad-Bold.ttf`)).then((res) => res.arrayBuffer()),
            fetch(new URL(`${appUrl}/Space_Mono,Turret_Road/Space_Mono/SpaceMono-Regular.ttf`)).then((res) => res.arrayBuffer()),
        ]);

        return new ImageResponse(
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
                    {/* Background blob - top left */}
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            top: '-120px',
                            left: '-120px',
                            width: '450px',
                            height: '450px',
                            borderRadius: '50%',
                            background: '#a5f3fc',
                        }}
                    />
                    {/* Background blob - bottom right */}
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            bottom: '-100px',
                            right: '-100px',
                            width: '380px',
                            height: '380px',
                            borderRadius: '50%',
                            background: '#67e8f9',
                        }}
                    />

                    {/* Main content */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                        }}
                    >
                        {/* Title section */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginBottom: '40px',
                            }}
                        >
                            {/* Affirm Daily title - matching gradient */}
                            <div
                                style={{
                                    display: 'flex',
                                    fontFamily: '"Turret Road"',
                                    fontSize: 80,
                                    fontWeight: 700,
                                    color: '#0891b2',
                                    letterSpacing: '-0.02em',
                                }}
                            >
                                Affirm Daily
                            </div>
                            {/* Date */}
                            <div
                                style={{
                                    display: 'flex',
                                    fontFamily: '"Space Mono"',
                                    fontSize: 26,
                                    color: '#0e7490',
                                    letterSpacing: '0.05em',
                                    marginTop: '8px',
                                }}
                            >
                                today, {date}
                            </div>
                        </div>

                        {/* Glass Card - matching exact styles from CSS */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(255, 255, 255, 0.25)',
                                border: '1px solid rgba(255, 255, 255, 0.6)',
                                borderRadius: '24px',
                                padding: '45px 60px',
                                maxWidth: '900px',
                                boxShadow: '0 8px 32px 0 rgba(6, 182, 212, 0.15)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    fontFamily: '"Space Mono"',
                                    fontSize: 38,
                                    fontWeight: 500,
                                    color: '#164e63',
                                    textAlign: 'center',
                                    lineHeight: 1.6,
                                }}
                            >
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
                    {
                        name: 'Turret Road',
                        data: turretRoadBold,
                        style: 'normal',
                        weight: 700,
                    },
                    {
                        name: 'Space Mono',
                        data: spaceMonoRegular,
                        style: 'normal',
                        weight: 400,
                    },
                ],
            },
        );
    } catch (e: any) {
        console.error(`[OG] Error generating image: ${e.message}`);
        console.error(e.stack);
        return new Response(`Failed to generate the image: ${e.message}`, {
            status: 500,
        });
    }
}
