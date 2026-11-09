# FreshCart

A grocery and general e-commerce store built on the [Route API](https://documenter.getpostman.com/view/5709532/2s93JqTRWN). You can browse products, keep a cart and wishlist without an account, then check out with cash on delivery or a card through Stripe.

Built with Next.js 16, React 19, TypeScript, TanStack Query, Tailwind v4, Auth.js, React Hook Form and Zod.

## Getting started

You'll need Node and pnpm. Please stick to pnpm, the lockfile is `pnpm-lock.yaml`.

```bash
pnpm install
```

Create a `.env.local` file:

```
AUTH_SECRET="..."
AUTH_TRUST_HOST=true
NEXT_PUBLIC_API_URL="https://ecommerce.routemisr.com/api/v1"
NEXT_PUBLIC_SITE_URL="https://freshcart-next.vercel.app"
```

`npx auth secret` will generate the secret for you. Then:

```bash
pnpm dev
```

The app runs on http://localhost:3000. For a production build use `pnpm build` and `pnpm start`.

## What's in it

- Home page with the hero slider, categories, promo banner, featured products and newsletter
- `/products` with filters, sorting and pagination, and `/products/[id]` with the gallery, reviews and related items
- `/search`, `/categories`, `/categories/[id]` and `/brands`
- `/cart` and `/wishlist`, which both work for guests
- `/checkout` with a saved or new address and the two payment options
- `/orders` for order history
- `/profile` for account details, addresses and settings
- `/contact` with the contact details and a message form
- `/login`, `/register` and `/forgot-password`, with the reset done in three steps (email, code, new password)
- Light and dark themes

## How login works

Login goes through Auth.js with a credentials provider that calls Route's sign in endpoint. Route's token stays inside the encrypted session cookie and never reaches the browser, so anything that needs it runs on the server, either as a server action or an `/api` route.

`src/proxy.ts` sends guests away from `/checkout`, `/orders` and `/profile`, and keeps signed-in users off the login pages.

Guest carts and wishlists live in `localStorage`. When someone signs in they get merged into the account, and if the same product is in both, the higher quantity wins.

## Notes

- There's no real keyword search, so search loads the filtered products and matches them in the browser.
- `/categories/:id/subcategories` can return another category's children, so we merge it with `/subcategories` and filter by category.
- Stock can change while something sits in a cart. Out of stock items show in red, don't count toward the total, and are removed before the order is placed.

Code structure and conventions are in [AGENTS.md](AGENTS.md).
