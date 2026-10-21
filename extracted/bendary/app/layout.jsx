import './globals.css'

export const metadata = {
  title: 'صيدليات البنداري | El-Bendary Pharmacies',
  description: 'الموقع الرسمي والتطبيق الإلكتروني لصيدليات البنداري - LENDAR since 1980',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
