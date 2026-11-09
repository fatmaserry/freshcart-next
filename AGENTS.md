# FreshCart

Store built on the [Route API](https://documenter.getpostman.com/view/5709532/2s93JqTRWN). The look and behavior should follow <https://freshcart-route.vercel.app>, so check the real page before changing UI.

Next.js 16 (App Router, Cache Components, `proxy.ts`), React 19, TypeScript, TanStack Query v5, Tailwind v4, Auth.js v5, React Hook Form with Zod, Font Awesome and React-Toastify.

## Commands

We use pnpm only.

```bash
pnpm dev
pnpm exec tsc --noEmit
pnpm exec eslint src
pnpm format
pnpm build
```

If you delete a route, run `pnpm build` before `tsc`. `.next/types/validator.ts` still points at the old route until you do.

## Env

These go in `.env.local`:

- `AUTH_SECRET` encrypts the session cookie
- `AUTH_TRUST_HOST` is `true` outside Vercel
- `NEXT_PUBLIC_API_URL` is the Route base URL
- `NEXT_PUBLIC_SITE_URL` is used for `robots.txt`, the sitemap and `metadataBase`. It falls back to the Vercel address

## Where things go

Requests flow one way:

```
app -> components -> hooks -> actions or lib/api -> Route API
```

- `src/app` has routes, metadata, Suspense boundaries and the `api/*` handlers. Business logic doesn't belong here.
- `src/components` is UI. It calls hooks and never the API.
- `src/hooks` holds every request, wrapped in `useQuery` or `useMutation`.
- `src/actions` has server actions for authenticated writes. Check ids and counts with `lib/actions/validate.ts` and wrap the work in `runAction`.
- `src/lib/api` has `HttpClient`, one service per resource and `ApiFacade`. `api` is for the browser, `serverApi` for the server. Everything goes to Route's v1, except `applyCoupon`, which only exists on v2.
- `src/lib/cart/StockGuard` is the only place that decides allowed quantities.
- `src/lib/guest` is the guest cart and wishlist in `localStorage`. They merge at login and sync across tabs with storage events.
- `src/lib/payment` has the `PaymentMethod` interface, one class per method and a single list of methods.
- `src/lib/validation/schemas` has one file per form. Anything used by more than one lives in `shared.ts`.
- `src/lib/locations` has delivery locations. `LocationRepository` backs `GET /api/locations`.
- `src/lib/query/keys.ts` has all the query keys.
- `src/lib/site.ts` has the site URL and `CONTACT_EMAIL`. Change the support address there.
- `src/styles/palette.css` has raw colors, `themes.css` gives them a role for each theme, and `src/app/globals.css` exposes those roles to Tailwind.

## Auth

`authorize()` signs in against Route, and the Route token only lives in the encrypted JWT cookie. The browser never sees it, and `api` has no token, so authenticated calls go through a server action or an `/api` route using `serverApi`.

Cart and wishlist reads use `GET /api/cart` and `GET /api/wishlist` instead of server actions. Server actions POST to the current URL, and that breaks on 404 pages.

`proxy.ts` protects `/checkout`, `/orders` and `/profile`, and keeps signed-in users off the login pages.

## Rules

- Raw `fetch` is only allowed in `HttpClient`.
- Query keys come from `queryKeys`, no inline arrays.
- Show a product's `price` only. Route's cart ignores `priceAfterDiscount`, so a discount shown in the store would never be charged.
- Comments explain why something is done. If the code already says what it does, leave the comment out.
- Keep it simple. Don't add a class or interface just to remove a bit of repetition, and split a file when it starts doing two jobs.
- Client components using `useParams` or `useSearchParams` need a `Suspense` boundary in their page.

### Colors

Use the role classes:

- Backgrounds: `bg-surface-page`, `bg-surface-card`, `bg-surface-alt`, `bg-surface-muted`
- Product and brand images: `bg-surface-media`
- Text: `text-heading`, `text-body`, `text-muted`, `text-hint`
- Borders: `border-line-soft`, `border-line-strong`
- Green: `brand-*`

Our own CSS variables start with `--fc-` and are named by role, like `--fc-text-muted`, so they can't clash with Tailwind or a library.

If you use a pale Tailwind status color (`red`, `amber`, `emerald` and so on), add a dark override in `themes.css`. Solid fills under white text shouldn't use an overridden shade, because it gets lighter in dark mode. Use the raw palette value instead, like `from-(--fc-violet-600)`.

### Icons, images and toasts

- Icons go through `<Icon name="..." />` from `components/ui/icons.tsx`. Glyphs render at `size * 0.85`, so a default icon is `size={18.8}`.
- `next/image` is lazy by default. Only use `priority` on something visible when the page opens.
- Toasts come straight from `react-toastify`. The container is in `Providers`.
