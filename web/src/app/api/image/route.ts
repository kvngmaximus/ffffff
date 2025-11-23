import { NextRequest } from "next/server"

const ALLOWED_HOSTS = new Set(["images.unsplash.com"]) // expand later for Supabase

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url")
  if (!urlParam) return new Response("Missing url", { status: 400 })

  let remote: URL
  try {
    remote = new URL(urlParam)
  } catch {
    return new Response("Invalid url", { status: 400 })
  }

  if (!ALLOWED_HOSTS.has(remote.hostname)) {
    return new Response("Host not allowed", { status: 403 })
  }

  try {
    const res = await fetch(remote.toString(), {
      headers: {
        // Unsplash works with default headers; user-agent kept minimal
        "User-Agent": "Beautify/1.0"
      },
      cache: "force-cache",
    })

    if (!res.ok) {
      return new Response(`Upstream ${res.status}`, { status: 502 })
    }

    const contentType = res.headers.get("content-type") || "image/jpeg"
    const body = await res.arrayBuffer()

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch (e) {
    return new Response("Fetch failed", { status: 502 })
  }
}