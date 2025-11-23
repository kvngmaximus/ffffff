import { NextRequest } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await supabase
    .from("products")
    .select("id, sku, name, description, price, discount_percent, stock_status, rating, review_count, image_url, category_id, categories:category_id(name, slug)")
    .eq("id", id)
    .maybeSingle()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  if (!data) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })

  const { data: images } = await supabase
    .from("product_images")
    .select("url, position")
    .eq("product_id", id)
    .order("position", { ascending: true })

  return new Response(JSON.stringify({ ...data, images: images || [] }), { status: 200 })
}