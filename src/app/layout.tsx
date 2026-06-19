import type { Metadata } from "next"
import "../styles/index.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "پنل مدیریت داده بینش",
  description: "سیستم هوشمند مدیریت داده‌ها",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
