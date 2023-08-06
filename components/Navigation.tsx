export default function Navigation() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      Navigation
      <ul>
        <li>Home</li>
        <li>Rent</li>
        <li>Reserve</li>
        <li>Calendar</li>
        <li>About</li>
        <li>Bulk Space</li>
        {/* TODO: add categories from sanity */}
      </ul>
    </div>
  )
}
