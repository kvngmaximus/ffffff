# Beautify Cosmetics Store — Product Requirements Document (PRD)

## 1. Overview
Beautify is a modern cosmetics e‑commerce experience built with Next.js, shadcn/ui, React, Supabase (auth, storage, database), and Flutterwave (payments). This PRD defines the homepage MVP and the supporting architecture to deliver a high‑quality, secure, and scalable foundation.

## 2. Goals
- Deliver a responsive, fast homepage reflecting the provided design.
- Showcase hero banner, category browsing, featured content, popular products, deals, and personalized CTA.
- Provide visible wishlist and cart widgets in the header with live counts.
- Establish frontend component architecture aligned with Next.js App Router and shadcn/ui.
- Prepare data shapes and mock content now; integrate Supabase and Flutterwave later without major refactors.

## 3. Non‑Goals (MVP)
- Full authentication and user profiles (added later).
- Real inventory, order management, and admin dashboards.
- Payment checkout flow (initialized later with Flutterwave).
- Comprehensive SEO copywriting; basic metadata only.

## 4. Audience & Personas
- Browsers discovering skincare/makeup products on mobile and desktop.
- Returning users tracking wishlist/cart items.
- Marketing visitors exploring featured content and sustainability messaging.

## 5. Homepage Scope (MVP)
1) Header
- Brand logo, primary nav, search input (static initial), category links, wishlist/cart widgets with counts.

2) Hero Section
- Full‑width banner with headline, supporting text, product image, price callout, primary CTA.

3) Category Carousel
- Horizontally scrollable categories (e.g., Cleanser, Moisturizer, Toner, Brightening, Foundation, Sunscreen, Serum).

4) Featured Banner
- Sustainability/brand story block with image and CTA.

5) Popular Products Grid
- 5–8 product cards with rating, price, discount badge, quick add to cart and wishlist.

6) Marketing Tiles
- 3–4 tiles (influencer picks, crafted quality, weekly promo, prevention tips) linking to collections.

7) Best Deals Grid
- Another grid emphasizing discounted items.

8) Personalized Treatment CTA
- Section inviting users to start a skin routine quiz or recommendation flow (CTA only for MVP).

9) Footer
- Basic links, social placeholders, support/contact.

## 6. Information Architecture
- Top‑level: Home, Shop, Categories, Deals, New, Brands, About.
- Collections and product detail pages scaffolded later; homepage links resolve to stub routes.

## 7. UI/UX Requirements
- Mobile‑first responsive layout; 360px → 1440px.
- Accessible components (ARIA labels, focus states, color contrast).
- Hover/pressed states for interactive elements.
- Skeleton loaders and optimistic badge updates for wishlist/cart actions.
- Performance targets: LCP < 2.5s on fast 3G, CLS < 0.1, TTI < 3s.

## 8. Components (Planned)
- `Header`: logo, nav, `SearchBar`, `WishlistWidget`, `CartWidget`.
- `HeroBanner`: image, copy, CTA.
- `CategoryCarousel`: scrollable category pills/cards.
- `FeaturedStory`: image + text block.
- `ProductCard`: image, name, price, rating, badges, add buttons.
- `ProductGrid`: responsive grid wrapper.
- `MarketingTiles`: set of promotional tiles.
- `DealsGrid`: product grid specialized for discounts.
- `PersonalizedCTA`: copy + button.
- `Footer`: links.

shadcn/ui primitives to leverage: `button`, `badge`, `card`, `carousel` (or community), `dialog` (future), `skeleton`, `sheet` (mobile nav), `toast`.

## 9. Data Models (Frontend Shapes)
```ts
type Category = {
  id: string
  name: string
  slug: string
  imageUrl?: string
}

type Product = {
  id: string
  name: string
  price: number
  description?: string
  imageUrl: string
  categoryId: string
  rating?: number
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock'
  discountPercent?: number
  tags?: string[]
}

type WishlistItem = {
  id: string
  productId: string
  userId?: string // present after auth
  createdAt: string
}

type CartItem = {
  id: string
  productId: string
  quantity: number
  userId?: string // present after auth
  createdAt: string
}
```

## 10. Supabase Schema (Planned)
- Tables: `products`, `categories`, `product_images`, `wishlists`, `carts`, `cart_items`, `orders` (later), `payments` (later).
- RLS: restrict by `auth.uid()` for wishlist/cart rows; public read of products with safe columns.
- Storage: bucket `product-images` for product assets.

## 11. Payment Architecture (Planned)
- Flutterwave standard checkout for MVP; inline JS later for custom.
- Edge Function webhook endpoint: verify signature, idempotent processing, update `payments` and `orders`.
- Environment variables: `FLUTTERWAVE_PUBLIC_KEY`, `FLUTTERWAVE_SECRET_KEY`, `FLUTTERWAVE_ENCRYPTION_KEY` (never stored client-side).

## 12. State Management
- React hooks + Context for `WishlistContext` and `CartContext` with optimistic updates and localStorage persistence pre‑auth.
- Supabase realtime subscriptions later to reflect cross‑device updates post‑auth.

## 13. Interactions & Acceptance Criteria
- Wishlist button: toggles state immediately, shows toast; header count updates.
- Cart button: adds item; quantity defaults to 1; header count updates; toast confirmation.
- Category pills: navigate to `/category/[slug]` (stub initially).
- Hero CTA: navigates to `/shop`.
- Product cards: click leads to `/product/[id]` (stub initially).
- Accessibility: keyboard navigable, proper labels, images with alt text.

## 14. Performance & Monitoring
- Image optimization via Next.js `Image` with responsive sizes.
- Static mock data via `generateStaticParams` or local JSON until Supabase.
- Logging basic client events; later wire analytics dashboard.

## 15. Security & Compliance
- No secrets in client bundle; use server routes and Edge Functions for sensitive operations.
- PCI‑DSS: use Flutterwave tokenization; never store card data.
- RLS policies and audit trails when backend is enabled.

## 16. Testing & QA
- Component tests for `ProductCard`, `WishlistWidget`, `CartWidget` interactions.
- Visual regression on key sections (hero, grids, tiles).
- Webhook handler tests (later) with sandbox payloads.

## 17. Milestones
M1: Homepage UI with mock data, header widgets working locally.
M2: Auth + Supabase tables, persisted wishlist/cart.
M3: Product pages and collections, search.
M4: Flutterwave checkout, orders, webhooks.

## 18. Risks & Mitigation
- Asset licensing for images → use placeholders until finalized.
- Carousel performance on low‑end devices → prefer CSS scroll‑snap; defer heavy libs.
- Data consistency pre/post auth → merge localStorage with server state on login.

## 19. Success Metrics
- Bounce rate reduction vs baseline.
- Add‑to‑wishlist and add‑to‑cart CTR.
- Homepage LCP and CLS within targets.

## 20. Open Questions
- Final brand copy and imagery approval.
- Category taxonomy depth.
- Search scope and provider.