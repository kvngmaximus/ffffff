import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PersonalizedCTA() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center">
        <h2 className="font-medium">Get Your Customised Skincare Treatment</h2>
        <p className="text-neutral-600 mt-2">We assess needs and design the perfect routine for you.</p>
        <div className="mt-4 flex justify-center">
          <Button asChild className="bg-black text-white hover:bg-neutral-800">
            <Link href="/routine">Start Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}