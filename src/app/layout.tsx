import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { Toaster } from "sonner";
import { AdminNotificationListener } from "@/components/common/AdminNotificationListener";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Shelly Indian Foods — Admin Dashboard",
  description: "Management and analytics dashboard for Shelly Indian Foods.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a201c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <NuqsAdapter>
          <ReduxProvider>
            <QueryProvider>
              <SocketProvider>
                <AdminNotificationListener />
                {children}
              </SocketProvider>
            </QueryProvider>
          </ReduxProvider>
        </NuqsAdapter>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
