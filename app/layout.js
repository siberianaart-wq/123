
export const metadata = {
  title: 'Si.beriana — Living Gallery',
  viewport: 'width=device-width, initial-scale=1',
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
