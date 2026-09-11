import type { Metadata } from "next";
import { Oswald, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: {
    default: `${SITE_NAME} | Professional Freight Dispatch Services`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Expert freight dispatch for owner-operators and small fleets — flatbed, dry van, step deck, power only, box truck, and hotshot.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Professional Freight Dispatch Services`,
    description:
      "Expert freight dispatch for owner-operators and small fleets — flatbed, dry van, step deck, power only, box truck, and hotshot.",
    images: [
      {
        url: "/images/trucks/ready-when-you-are.png",
        width: 1200,
        height: 630,
        alt: "Semi truck on the road representing Autohausia's freight dispatch services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Professional Freight Dispatch Services`,
    description:
      "Expert freight dispatch for owner-operators and small fleets — flatbed, dry van, step deck, power only, box truck, and hotshot.",
    images: ["/images/trucks/ready-when-you-are.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
