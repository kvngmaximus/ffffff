"use client"

import { cn } from "@/lib/utils"

export default function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p:number)=>void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        «
      </button>
      {pages.slice(0, Math.min(10, totalPages)).map(p => (
        <button
          key={p}
          className={cn("w-8 h-8 rounded-full", p === page ? "bg-emerald-800 text-white" : "bg-neutral-100 text-neutral-700")}
          onClick={() => onPage(p)}
        >
          {p}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
      >
        »
      </button>
    </div>
  )
}