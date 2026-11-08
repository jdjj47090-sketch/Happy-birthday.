import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title:'ASOUGA — عالم اسوقة', description:'A World Made Just for You ♡' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ar" dir="rtl"><body>{children}</body></html>; }
