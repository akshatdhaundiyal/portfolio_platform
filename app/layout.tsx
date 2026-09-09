import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Newsreader, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-handwritten",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Akshat Dhaundiyal | AI Product Strategy & Applied ML Systems",
  description:
    "Executive portfolio of Akshat Dhaundiyal: Data Scientist & MBA candidate bridging commercial strategy, unit economics, and deep machine learning architectures.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://akshatdhaundiyal.com"),
  openGraph: {
    title: "Akshat Dhaundiyal | AI Product Strategy & Applied ML Systems",
    description:
      "Bridging data science rigor with product strategy: Actuarial GLMs (+$12M impact), Google Vertex AI NLP pipelines, and local-first AI systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${newsreader.variable} ${caveat.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#f6f4ee] dark:bg-[#121316] text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col font-sans selection:bg-[#d94e34]/30 selection:text-white antialiased transition-colors duration-200">
        <ThemeProvider>
          {/* Ambient Desk Pattern Background */}
          <div className="fixed inset-0 bg-desk-pattern opacity-70 pointer-events-none z-0" />

          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
