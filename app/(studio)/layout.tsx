import 'styles/studio.css'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="m-0 p-0">
        <main>{children}</main>
      </body>
    </html>
  )
}
