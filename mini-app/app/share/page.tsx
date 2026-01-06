
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { minikitConfig } from '@/minikit.config';
import { format } from 'date-fns';

export const runtime = 'edge';

export async function generateMetadata(props: { searchParams: Promise<any> }): Promise<Metadata> {
    const searchParams = await props.searchParams;
    const affirmation = searchParams.affirmation;
    const date = searchParams.date || format(new Date(), "d MMM");

    let appUrl = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    if (!appUrl.startsWith('http')) {
        appUrl = `https://${appUrl}`;
    }

    const params = new URLSearchParams();
    if (affirmation) params.append('affirmation', affirmation);
    params.append('date', date);
    params.append('v', '2');

    const frameImageUrl = `${appUrl}/api/og?${params.toString()}`;
    console.log('[SharePage] Generated OG Image URL:', frameImageUrl);

    const fcFrameContent = JSON.stringify({
        version: minikitConfig.frame.version,
        imageUrl: frameImageUrl,
        button: {
            title: `Open Affirm Daily`,
            action: {
                name: `Launch ${minikitConfig.frame.name}`,
                type: "launch_frame",
                url: appUrl,
                splashImageUrl: `${appUrl}/icon.png`,
                splashBackgroundColor: "#06b6d4",
            },
        },
    });

    return {
        title: 'Affirm Daily',
        description: `Daily Affirmation: "${affirmation}"`,
        other: {
            "fc:frame": fcFrameContent,
        },
        openGraph: {
            title: 'Affirm Daily',
            description: `Daily Affirmation: "${affirmation}"`,
            images: [frameImageUrl],
        },
    };
}

export default function SharePage() {
    redirect('/');
}
