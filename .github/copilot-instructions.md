<!-- Copilot Instructions for GREENCART-main -->
# GREENCART — Copilot Instructions (concise)

This file contains repository-specific guidance to help AI coding agents be productive immediately.

1. Big-picture architecture
- Mono-repo with two primary folders: `client/` (React + Vite) and `server/` (Express + Node).
- The `server/` exposes a REST API under `/api/*` (see `server/server.js` where routes are mounted: `user`, `seller`, `product`, `cart`, `address`, `order`, `payment`, `chat`).
- `client/` calls the backend using an Axios instance in `client/src/config/api.js` (default `baseURL: "http://localhost:5000/api"`). Verify this when running locally: the server default port is `4000` (see `server/server.js`).

2. Run & debug workflows
- Start backend (dev): from `server/` run `npm install` then `npm run server` (uses `nodemon server.js`). Production start: `npm start`.
- Start frontend (dev): from `client/` run `npm install` then `npm run dev` (Vite).
- Build & serve frontend in production: `cd client && npm run build` produces `client/dist`; the server serves `../client/dist` (see `server/server.js`).

3. Key patterns & conventions
- ES modules only: `package.json` in `server/` has `"type": "module"`. Use `import`/`export` consistently.
- Route mounting: each resource route file (e.g. `server/routes/paymentRoute.js`) is mounted under `/api/<resource>` in `server/server.js`.
- Controllers implement business logic (e.g. `server/controllers/paymentController.js`) and call into models in `server/models/`.
- Middleware ordering matters: the Stripe webhook is registered first using `express.raw(...)` in `server/server.js` — do not move or wrap this behind `express.json()`.

4. Environment & integration points
- DB: `server/configs/db.js` reads `process.env.MONGO_URI`.
- Payments: `server/configs/razorpay.js` uses `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Examples: `server/controllers/paymentController.js` uses `razorpay.orders.create(...)` and verifies HMAC with `RAZORPAY_KEY_SECRET`.
- Cloudinary: `server/configs/cloudinary.js` configures `cloudinary` (check for credentials or usage elsewhere).
- File uploads: `server/configs/multer.js` exports a `multer` instance used by routes that accept files.
- Cookies/CORS: client `API` uses `withCredentials: true`; server config uses `cookie-parser` and `cors` with `credentials:true` and an `allowedOrigins` list — update both sides if you change domains.

5. Notable inconsistencies to check when editing
- `client/src/config/api.js` sets `baseURL: "http://localhost:5000/api"` while `server/server.js` defaults to port `4000`. Confirm the intended dev port and update one side or use env-based config.

6. File examples to reference when coding
- Server entry and route mounts: `server/server.js`
- DB setup: `server/configs/db.js`
- Razorpay integration: `server/configs/razorpay.js` and `server/controllers/paymentController.js`
- Payment routes: `server/routes/paymentRoute.js`
- Client HTTP wrapper: `client/src/config/api.js`

7. Coding conventions & quick tips
- Preserve ES module syntax and top-level `await` usage pattern already present in `server/server.js`.
- Use existing middleware pattern: `authUser` and `authSeller` live under `server/middlewares/` and are used per-route.
- When adding routes, follow the `/api/<resource>` mounting convention and put controller logic under `server/controllers/` and data schemas under `server/models/`.

8. When uncertain
- If you need to change ports, env names, or CORS origins, update both `client/src/config/api.js` and `server/server.js` (and document the change in this file).
- For payment or webhook changes, preserve the `express.raw(...)` webhook handler placement and HMAC verification logic in `server/controllers/paymentController.js`.

If any section is unclear or you want more detail (examples of model usage, common controller patterns, or sample env file), tell me which part to expand.
