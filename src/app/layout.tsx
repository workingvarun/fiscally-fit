import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { t } from '@/lib/i18n';

// The GeistSans object from 'geist/font/sans' is not a function.
// It directly provides .variable and .className properties.
// The options previously passed (variable name and subsets) are defaults for GeistSans.

export const metadata: Metadata = {
  title: t('appName'),
  description: t('appDescription'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Use GeistSans.variable directly */}
      <body className={`${GeistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
