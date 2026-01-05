import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const affirmation = searchParams.get('affirmation') || 'You are capable of amazing things.';
        const date = searchParams.get('date') || 'today';

        console.log('[OG] Generating image for:', affirmation, date);

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
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    {/* Title */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginBottom: '30px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 60,
                                fontWeight: 700,
                                color: '#0891b2',
                                marginBottom: '10px',
                            }}
                        >
                            Affirm Daily
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 24,
                                color: '#0e7490',
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
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            border: '2px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '20px',
                            padding: '40px 60px',
                            maxWidth: '900px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                fontSize: 36,
                                fontWeight: 400,
                                color: '#164e63',
                                textAlign: 'center',
                                lineHeight: 1.4,
                            }}
                        >
                            &quot;{affirmation}&quot;
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
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
