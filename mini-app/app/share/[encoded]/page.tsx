
import { Metadata } from 'next';
import { format } from 'date-fns';

type Props = {
    params: Promise<{ encoded: string }>;
};

// Generate metadata for the share page
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    // Await the params promise
    const { encoded } = await params;

    const affirmation = decodeURIComponent(encoded);
    const date = format(new Date(), "d MMM");

    // Use the current host or default to localhost for development
    const host = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL}` : 'http://localhost:3000';

    const imageUrl = `${host}/api/og?affirmation=${encodeURIComponent(affirmation)}&date=${encodeURIComponent(date)}`;
    const appUrl = `${host}`;

    return {
        title: 'Affirm Daily',
        description: `Daily Affirmation: "${affirmation}"`,
        openGraph: {
            title: 'Affirm Daily',
            description: `Daily Affirmation: "${affirmation}"`,
            images: [imageUrl],
        },
        other: {
            "fc:frame": "vNext",
            "fc:frame:image": imageUrl,
            "fc:frame:button:1": "Open Affirm Daily",
            "fc:frame:button:1:action": "link",
            "fc:frame:button:1:target": appUrl,
        },
    };
}

export default async function SharePage({ params }: Props) {
    const { encoded } = await params;
    const affirmation = decodeURIComponent(encoded);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cyan-50 text-cyan-900 font-mono text-center">
            <h1 className="text-2xl font-bold mb-4 font-turret">Affirm Daily</h1>
            <p className="text-xl max-w-lg">"{affirmation}"</p>
            <div className="mt-8">
                <a
                    href="/"
                    className="px-6 py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition-colors"
                >
                    Open App
                </a>
            </div>
        </div>
    );
}
