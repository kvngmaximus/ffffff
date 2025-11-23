import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams
  const categoryParam = search.get("category")
  const page = parseInt(search.get("page") || "1", 10)
  const pageSize = parseInt(search.get("pageSize") || "100", 10)

  let categoryIds: string[] = []
  if (categoryParam) {
    const parts = categoryParam.split(",").filter(Boolean)
    const { data: catBySlug } = await supabase
      .from("categories")
      .select("id, slug")
      .in("slug", parts)
    categoryIds = (catBySlug || []).map(c => c.id)
  }

  let query = supabase
    .from("products")
    .select("id, sku, name, description, price, discount_percent, stock_status, rating, review_count, image_url, category_id, categories:category_id(name, slug)")
    .order("created_at", { ascending: false })

  if (categoryIds.length) {
    query = query.in("category_id", categoryIds)
  }

  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  query = query.range(start, end)

  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ items: data || [] }), { status: 200 })
}