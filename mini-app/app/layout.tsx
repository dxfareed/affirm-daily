import type { Metadata, Viewport } from "next";
import { minikitConfig } from "@/minikit.config";
import { RootProvider } from "./rootProvider";
import "./globals.css";
// import fontStyles from './fonts.module.css'; // Removed old font
import { Analytics } from "@vercel/analytics/next";
import localFont from 'next/font/local';

const spaceMono = localFont({
  src: [
    {
      path: '../public/Space_Mono,Turret_Road/Space_Mono/SpaceMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Space_Mono/SpaceMono-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Space_Mono/SpaceMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Space_Mono/SpaceMono-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-space-mono',
  display: 'swap',
});

const turretRoad = localFont({
  src: [
    {
      path: '../public/Space_Mono,Turret_Road/Turret_Road/TurretRoad-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Turret_Road/TurretRoad-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Turret_Road/TurretRoad-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Turret_Road/TurretRoad-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/Space_Mono,Turret_Road/Turret_Road/TurretRoad-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-turret-road',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: 'cover',
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.frame.name,
    description: minikitConfig.frame.description,
    other: {
      "fc:frame": JSON.stringify({
        version: minikitConfig.frame.version,
        imageUrl: minikitConfig.frame.heroImageUrl,
        button: {
          title: `Generate ${minikitConfig.frame.name}`,
          action: {
            name: `Launch ${minikitConfig.frame.name}`,
            type: "launch_frame",
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} ${turretRoad.variable} antialiased`}>
        <RootProvider>{children}</RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
