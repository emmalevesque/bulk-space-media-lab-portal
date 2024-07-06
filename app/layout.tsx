import 'styles/studio.css'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }} className="m-0 p-0">
        <main>{children}</main>
      </body>
    </html>
  )
}
