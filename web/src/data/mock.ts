import { Brand, Category, Product } from "@/lib/types"

export const categories: Category[] = [
  { id: "c1", name: "Cleanser", slug: "cleanser", imageUrl: "/images/aquaaura.png" },
  { id: "c2", name: "Moisturizer", slug: "moisturizer", imageUrl: "/images/oceanmist.png" },
  { id: "c3", name: "Toner", slug: "toner", imageUrl: "/images/arganglow.png" },
  { id: "c4", name: "Brightening", slug: "brightening", imageUrl: "/images/smoothcream.png" },
  { id: "c5", name: "Foundation", slug: "foundation", imageUrl: "/images/velvetrose.png" },
  { id: "c6", name: "Sunscreen", slug: "sunscreen", imageUrl: "/images/arganglow.png" },
  { id: "c7", name: "Serum", slug: "serum", imageUrl: "/images/silkskinserum.png" }
]

export const products: Product[] = [
  { id: "p1", name: "SilkSculpt", price: 35, imageUrl: "/images/silkskinserum.png", categoryId: "c7", categoryName: "Skin Care", rating: 4.9, reviewCount: 245, stockStatus: "in_stock", discountPercent: 50, bestSeller: true, skinType: "Normal", sku: "GRFR85648HGJ", sizes: ["30 ml","60 ml","80 ml","100 ml"], tags: ["Skincare","Serums","Vitamin C"], images: [
    "/images/silkskinserum.png"
  ] },
  { id: "p2", name: "SilkSkin Serum", price: 48, imageUrl: "/images/silkskinserum.png", categoryId: "c7", categoryName: "Skin Care", rating: 4.9, reviewCount: 245, stockStatus: "in_stock", discountPercent: 20, skinType: "Combination", sku: "GRFR85648HGK", sizes: ["30 ml","60 ml","80 ml","100 ml"], tags: ["Skincare","Serums","Retinol"], images: [
    "/images/silkskinserum.png"
  ] },
  { id: "p3", name: "Argan Glow", price: 63, imageUrl: "/images/arganglow.png", categoryId: "c6", categoryName: "Hair Care", rating: 5.0, reviewCount: 112, stockStatus: "in_stock", skinType: "Dry", sku: "ARG12345", sizes: ["30 ml","60 ml"], tags: ["Hair Care","Argan"], images: [
    "/images/arganglow.png"
  ] },
  { id: "p4", name: "Exaltata Kit", price: 45, imageUrl: "/images/Exaltata.jpeg", categoryId: "c2", categoryName: "Body Care", rating: 5.0, reviewCount: 87, stockStatus: "in_stock", discountPercent: 10, skinType: "Sensitive", sku: "EXA99887", sizes: ["80 ml"], tags: ["Body Care"], images: [
    "/images/Exaltata.jpeg"
  ] },
  { id: "p5", name: "Foundation", price: 20, imageUrl: "/images/velvetrose.png", categoryId: "c5", categoryName: "Makeup", rating: 4.9, reviewCount: 321, stockStatus: "in_stock", discountPercent: 50, skinType: "Oily", sku: "FOU65432", sizes: ["30 ml","60 ml"], tags: ["Makeup","Foundation"], images: [
    "/images/velvetrose.png"
  ] },
  { id: "p6", name: "Smooth Body", price: 30, imageUrl: "/images/smoothcream.png", categoryId: "c2", categoryName: "Body Care", rating: 5.0, reviewCount: 140, stockStatus: "in_stock", discountPercent: 50, skinType: "Normal", sku: "CREM77881", sizes: ["80 ml","100 ml"], tags: ["Body Care","Cream"], images: [
    "/images/smoothcream.png"
  ] },
  { id: "p7", name: "AquaAura", price: 30, imageUrl: "/images/aquaaura.png", categoryId: "c2", categoryName: "Body Care", rating: 4.8, reviewCount: 90, stockStatus: "in_stock", discountPercent: 50, skinType: "Combination", sku: "AQAA11223", sizes: ["60 ml","100 ml"], tags: ["Body Care"], images: [
    "/images/aquaaura.png"
  ] },
  { id: "p8", name: "Velvet Rose", price: 10, imageUrl: "/images/velvetrose.png", categoryId: "c5", categoryName: "Makeup", rating: 4.9, reviewCount: 210, stockStatus: "in_stock", discountPercent: 50, skinType: "Dry", sku: "VROS77665", sizes: ["30 ml"], tags: ["Makeup"], images: [
    "/images/velvetrose.png"
  ] },
  { id: "p9", name: "Herbal Haven", price: 10, imageUrl: "/images/herbalhaven.png", categoryId: "c2", categoryName: "Body Care", rating: 5.0, reviewCount: 124, stockStatus: "in_stock", discountPercent: 50, skinType: "Sensitive", sku: "HHAV88992", sizes: ["80 ml"], tags: ["Body Care"], images: [
    "/images/herbalhaven.png"
  ] },
  { id: "p10", name: "Essence Body", price: 30, imageUrl: "/images/essencebodygel.png", categoryId: "c2", categoryName: "Body Care", rating: 4.8, reviewCount: 88, stockStatus: "in_stock", discountPercent: 50, skinType: "Normal", sku: "EBGL44772", sizes: ["60 ml"], tags: ["Body Care"], images: [
    "/images/essencebodygel.png"
  ] },
  { id: "p11", name: "HydraLuxe", price: 20, imageUrl: "/images/hydraluxe.png", categoryId: "c7", categoryName: "Skin Care", rating: 4.9, reviewCount: 245, stockStatus: "in_stock", discountPercent: 50, skinType: "Combination", sku: "HYDL23444", sizes: ["30 ml","60 ml"], tags: ["Skincare","Serums"], images: [
    "/images/hydraluxe.png"
  ] },
  { id: "p12", name: "OceanMist", price: 20, imageUrl: "/images/oceanmist.png", categoryId: "c2", categoryName: "Skin Care", rating: 4.8, reviewCount: 133, stockStatus: "in_stock", discountPercent: 50, skinType: "Oily", sku: "OCMS44577", sizes: ["80 ml","100 ml"], tags: ["Skincare","Moisturizer"], images: [
    "/images/oceanmist.png"
  ] }
]

export const brands: Brand[] = [
  { id: "b1", name: "AquaAura", slug: "aquaaura", imageUrl: "/images/aquaaura.png", description: "Hydration-first skincare designed for daily glow." },
  { id: "b2", name: "SilkSkin", slug: "silkskin", imageUrl: "/images/silkskinserum.png", description: "Targeted serums with clinically tested actives." },
  { id: "b3", name: "Velvet Beauty", slug: "velvet-beauty", imageUrl: "/images/velvetrose.png", description: "Makeup essentials for a soft matte finish." },
  { id: "b4", name: "Herbal Haven", slug: "herbal-haven", imageUrl: "/images/herbalhaven.png", description: "Botanical formulations for sensitive skin types." },
  { id: "b5", name: "HydraLuxe", slug: "hydraluxe", imageUrl: "/images/hydraluxe.png", description: "Luxe serums for visible results." },
  { id: "b6", name: "Essence Lab", slug: "essence-lab", imageUrl: "/images/essencebodygel.png", description: "Minimalist routines, maximal benefits." }
]

export const hero = {
  title: "Proven To Tackle Wrinkles & Acne",
  copy: "Works on all skin types and tones. Clinically tested and dermatologically approved.",
  priceLabel: "From $18",
  cta: { label: "View Shop", href: "/shop" },
  imageUrl: "/images/collection.png"
}

export const featured = {
  title: "Our Commitment To Sustainability",
  copy: "We source premium ingredients ethically and use planet-friendly packaging.",
  cta: { label: "View Policy", href: "/about" },
  imageUrl: "/images/collection2.png"
}