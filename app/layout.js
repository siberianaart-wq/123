
export const metadata = {
  title: 'Si.beriana — Living Gallery',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0, background:"#0b0b0b", color:"white"}}>
        {children}
      </body>
    </html>
  )
}
