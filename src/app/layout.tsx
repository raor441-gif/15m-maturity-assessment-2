import type { Metadata } from 'next';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';

export const metadata: Metadata = {
  title: '15M Procurement Maturity Cockpit | Sourcing Champions',
  description: 'Enterprise 15M Procurement Maturity Diagnostic and Transformation Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50 text-slate-800">
        <AssessmentProvider>
          {children}
        </AssessmentProvider>
      </body>
    </html>
  );
}
