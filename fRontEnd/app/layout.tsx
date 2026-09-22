import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Montserrat, DM_Serif_Display, Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/site-header'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif-display',
})

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'TaleemHub Pakistan — Scholarships & Student Schemes Portal',
  description:
    'Real-time directory of verified Pakistani government scholarships, laptop programs, and provincial education grants with deadline tracking.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${montserrat.className} ${montserrat.variable} ${dmSerifDisplay.variable} ${outfit.variable} ${plusJakartaSans.variable} font-sans antialiased overflow-x-clip bg-background text-foreground selection:bg-pak-green selection:text-white`}>
        <Providers>
          <div className="flex min-h-dvh flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/60 py-6 bg-background">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row text-sm text-muted-foreground">
                <p>TaleemHub · Pakistan Scholarships &amp; Youth Opportunities Portal</p>
                <div className="flex items-center gap-5">
                  <a href="/about" className="text-sm font-medium hover:text-pak-green transition-colors">About Us</a>
                  <a href="/contact" className="text-sm font-medium hover:text-pak-green transition-colors">Contact &amp; Submissions</a>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
