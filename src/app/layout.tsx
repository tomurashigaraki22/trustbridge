import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { SidebarProvider } from '@/context/SidebarContext'
import { OTPProvider } from "@/context/OTPContext";
import { AccessCodeProvider } from "@/context/AccessContext";
import Script from 'next/script';
import { TranslateProvider } from "@/context/TranslateContext";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'}`
  },
  description: `${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'} is a crypto based AI Trading and MultiChain Wallet Platform that allows you to make crypto transactions easily and invest in crypto`,
  keywords: ['crypto trading', 'AI trading', 'cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'digital assets', 'crypto wallet', 'investment platform', 'crypto investment'],
  authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader' }],
  creator: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
  publisher: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://Ai-Trader.com',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    description: `${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'} - Advanced Crypto Trading Platform with AI`,
    siteName: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'Ai Crypto Trading and Wallet Platform Preview',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader',
    description: `${process.env.NEXT_PUBLIC_APP_NAME || 'Ai-Trader'} - Advanced Crypto Trading Platform with AI`,
    images: ['/og.png'],
    creator: '@Ai-Trader',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-site-verification',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
};





export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const widget_id = process.env.NEXT_PUBLIC_SUPPORT_WIDGET_ID?.trim();
  const smartsupp = process.env.NEXT_PUBLIC_SMARTSUPP_CODE?.trim();
  const env_upgraded = process.env.NEXT_PUBLIC_ENV_UPGRADED === 'true';

  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        {env_upgraded ? (
          <AuthProvider>
            <OTPProvider>
              <SidebarProvider>
                <AccessCodeProvider>
                  <TranslateProvider>
                    {children}
                  </TranslateProvider>
                </AccessCodeProvider>
              </SidebarProvider>
            </OTPProvider>
          </AuthProvider>
        ) : (
          <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Upgrade in progress</h1>
              <p className="text-gray-400">Please check back later</p>
            </div>
          </div>
        )}
          {/* <Script
            src={`//code.jivosite.com/widget/dTLqg0pRtZ`}
            strategy="afterInteractive"
          /> */}
        {/* {smartsupp && smartsupp.length > 0 && (

          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '${process.env.NEXT_PUBLIC_SMARTSUPP_CODE}';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';
              s.parentNode.insertBefore(c,s);
            })(document);
          `,
            }}
          />
        )} */}
      </body>
    </html>
  );
}
