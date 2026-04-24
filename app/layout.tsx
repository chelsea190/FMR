import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthContextProvider } from '@/contexts/AuthContext';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Find Me RX - Medication Access Platform',
  description: 'Find nearby pharmacies, search medications, and order prescriptions',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={jakarta.className}>
        <ThemeProvider>
          <AuthContextProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-gray-100',
                style: {
                  borderRadius: '12px',
                  padding: '16px',
                },
              }}
            />
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
