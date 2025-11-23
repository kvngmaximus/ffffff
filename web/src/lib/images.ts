export function proxiedImage(url: string) {
  if (url.startsWith("/")) return url
  return `/api/image?url=${encodeURIComponent(url)}`
}