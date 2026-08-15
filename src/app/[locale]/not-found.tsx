import type { Metadata } from 'next';
import NotFoundContent from './NotFoundContent';

export const metadata: Metadata = {
  title: 'Tool Not Found | YesConvert',
  description: 'The requested PDF tool could not be found on YesConvert.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: null,
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return <NotFoundContent />;
}
