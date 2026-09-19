import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'TaleemHub Pakistan — Scholarships & Student Schemes Portal',
  description:
    'Discover, filter and bookmark government scholarships, grants and education schemes across Pakistan. Track deadlines and eligibility in one place.',
  generator: 'v0.app',
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
    <html lang="en">
      <body className="antialiased overflow-x-clip">
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/60 py-6 bg-muted/20">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row text-sm text-muted-foreground">
                <p>TaleemHub · Pakistan Scholarships &amp; Youth Opportunities Portal</p>
                <div className="flex items-center gap-5">
                  <a href="/about" className="text-sm font-medium hover:text-foreground transition-colors">About Us</a>
                  <a href="/contact" className="text-sm font-medium hover:text-foreground transition-colors">Contact &amp; Submissions</a>
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
