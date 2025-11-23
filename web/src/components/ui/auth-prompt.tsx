"use client"
import * as Dialog from "@radix-ui/react-dialog"
import Link from "next/link"

export default function AuthPrompt({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-sm rounded-lg bg-white p-4 shadow-xl ring-1 ring-neutral-200">
          <Dialog.Title className="text-lg font-semibold text-[#1C1C1C]">Sign in required</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-[#555D63]">
            You need to sign in to add items to cart or wishlist.
          </Dialog.Description>
          <div className="mt-4 flex items-center gap-3">
            <Link href="/auth" className="bg-[#4D6B57] text-white rounded-md px-3 py-2">Go to Sign In</Link>
            <button className="rounded-md border px-3 py-2" onClick={()=>onOpenChange(false)}>Cancel</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}