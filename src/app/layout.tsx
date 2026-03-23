import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Poppins, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
	title: "CodeNaya — AI-Powered Code Editor in Your Browser",
	description: "Build, edit, and deploy code projects instantly with AI assistance. No setup required.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plexMono.variable} ${poppins.variable} ${dmSans.variable} antialiased`}
      >
          <Providers>
            {children}
          </Providers>
      </body>
    </html>
	);
}
