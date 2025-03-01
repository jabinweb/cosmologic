import '@/styles/globals.css';
import '@/styles/playground.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SessionProvider } from '@/providers/session-provider';
import { SubscriptionProvider } from '@/providers/subscription-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cosmologic Academy - Learn Coding the Right Way',
  description: 'We make coding simple, fun, and affordable for everyone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          defer
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SubscriptionProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </SubscriptionProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}