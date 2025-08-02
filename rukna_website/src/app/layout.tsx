import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/session-provider";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "رُكْنَة - Rukna | Authentic Asir Experiences",
  description: "AI-powered platform connecting tourists with local guides for authentic cultural experiences in the Asir region.",
  keywords: ["tourism", "Asir", "Saudi Arabia", "local guides", "authentic experiences", "cultural tourism"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <Link href="/" className="font-camel text-xl font-bold text-gradient">
                    Rukna
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Discover
                    </Link>
                    <UserNav />
                  </div>
                </div>
              </div>
            </nav>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
