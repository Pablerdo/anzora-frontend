import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="flex justify-end p-4">
      <Link href="/" className="mr-4 text-primary hover:underline">Video</Link>
      <Link href="/image" className="text-orange-500 hover:underline">Image</Link>
    </nav>
  )
}

