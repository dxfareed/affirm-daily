
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const affirmation = searchParams.get('affirmation') || 'You are capable of amazing things.';
        const date = searchParams.get('date') || 'today';

        // Load Fonts
        const turretRoadBold = await fetch(new URL('../../../public/Space_Mono,Turret_Road/Turret_Road/TurretRoad-Bold.ttf', import.meta.url)).then((res) => res.arrayBuffer());
        const spaceMonoRegular = await fetch(new URL('../../../public/Space_Mono,Turret_Road/Space_Mono/SpaceMono-Regular.ttf', import.meta.url)).then((res) => res.arrayBuffer());

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
                        backgroundColor: '#ecfeff', // Cyan-50
                        position: 'relative',
                    }}
                >
                    {/* Decorative Blobs */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-150px',
                            left: '-150px',
                            width: '500px',
                            height: '500px',
                            borderRadius: '50%',
                            background: '#a5f3fc', // Cyan-200
                            filter: 'blur(80px)',
                            opacity: 0.6,
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-100px',
                            right: '-100px',
                            width: '400px',
                            height: '400px',
                            borderRadius: '50%',
                            background: '#67e8f9', // Cyan-300
                            filter: 'blur(80px)',
                            opacity: 0.6,
                        }}
                    />

                    {/* Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                        }}
                    >
                        {/* Title */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                            <div
                                style={{
                                    fontFamily: '"Turret Road"',
                                    fontSize: 60,
                                    fontWeight: 700,
                                    backgroundImage: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                                    backgroundClip: 'text',
                                    color: 'transparent',
                                    marginBottom: '10px',
                                }}
                            >
                                Affirm Daily
                            </div>
                            <div
                                style={{
                                    fontFamily: '"Space Mono"',
                                    fontSize: 24,
                                    color: '#0e7490',
                                    opacity: 0.8,
                                }}
                            >
                                Today, {date}
                            </div>
                        </div>

                        {/* Card */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.45)',
                                border: '2px solid rgba(255, 255, 255, 0.8)',
                                borderRadius: '40px',
                                padding: '60px',
                                width: '800px',
                                boxShadow: '0 15px 50px rgba(6, 182, 212, 0.2)',
                                textAlign: 'center',
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: '"Space Mono"',
                                    fontSize: 40,
                                    fontWeight: 400,
                                    color: '#164e63',
                                    textAlign: 'center',
                                    lineHeight: 1.4,
                                }}
                            >
                                "{affirmation}"
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
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
