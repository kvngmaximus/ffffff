export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-600 flex items-center justify-between">
        <div>© {new Date().getFullYear()} Beautify</div>
        <div className="flex gap-4">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  )
}