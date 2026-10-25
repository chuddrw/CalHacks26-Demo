# Simple Shop

A small shopping website: browse eight products, add them to a cart, remove them, and pay with a simulated checkout. No server and no real payment: everything runs in the browser.

```sh
npm ci
npm start          # opens on http://127.0.0.1:5173
npm run typecheck
npm test
npm run build      # production build in dist/
```

To pay, use card `4242 4242 4242 4242`, CVC `123`, any name, a valid email and an expiry date in the future. No money is charged. After paying, the cart empties and a confirmation with the amount paid appears under it.

## How it fits together

One cart instance is shared by every part (`src/main.ts`). All prices are integer cents in USD, and only the cart calculates totals.

| Part | Folder | What it does |
|---|---|---|
| Catalog | `src/catalog/` | Product data (kept apart from the UI) and a responsive grid with an "Add to cart" button per product |
| Cart | `src/cart/` | `addItem`, `getItems`, `getTotalCents`, `clearCart`, change notifications, and the cart table: quantity, unit price, line total, total, an empty-cart message, Checkout disabled when empty |
| Removal | `src/removal/` | `removeItem(productId)` and a Remove button in each cart row, labeled with the product's name for screen readers. Removes every unit, and ignores unknown IDs |
| Checkout | `src/checkout/` | The payment dialog: order summary, test-card validation, a simulated payment that clears the cart |
| Shared types | `src/contracts/` | `Product` and `CartItem` |

The four parts were built by four teammates' coding agents in parallel, each owning one folder, and then put together here.
