# Shelly Indian Foods Admin — Project Context

This document provides a comprehensive overview of the **Shelly Indian Foods Admin Dashboard** codebase, its directory structure, technical stack, core states, data flow, routing, and recently added components/features.

---

## 1. Project Overview

**Shelly Indian Foods Admin** is the administrative and staff portal for the Shelly Indian Foods wholesale ordering platform. It enables administrators and authorized salesmen to manage retailer accounts, monitor active orders, update product & category catalogs, manage staff credentials, and configure platform settings.

---

## 2. Technical Stack

- **Framework**: Next.js 16.3.0 (using App Router & Turbopack)
- **Runtime**: React 19 & React DOM 19
- **State Management**: Redux Toolkit & Redux Persist (`localStorage` for Auth & Notification slices)
- **URL Search Params Management**: `nuqs` (v2 with Next.js App Router adapter)
- **Data Fetching & Cache**: TanStack React Query (`@tanstack/react-query`)
- **Form Management & Validation**: React Hook Form (`react-hook-form`) & Zod (`zod`)
- **API Client**: Axios (configured with token refresh interceptors & S3 upload helpers)
- **Real-Time Communications**: Socket.io-client (`socket.io-client` with auth `ready` status gating) & Firebase Cloud Messaging (`firebase/app`, `firebase/messaging`)
- **Styling**: Tailwind CSS 4.3.3 + PostCSS
- **Language**: TypeScript 5.7.3

---

## 3. Directory Structure

```
├── app/                      # Next.js App Router folders & pages
│   ├── (auth)/               # Guest authentication views
│   │   └── login/            # Unified staff login page (Admin & Salesman)
│   ├── (dashboard)/          # Protected admin/staff panel pages
│   │   ├── categories/       # Category management (list, new, edit)
│   │   ├── notifications/    # Dedicated Admin Notifications page
│   │   ├── orders/           # Order management
│   │   │   ├── [id]/         # Order detail view (OrderHeader, OrderCustomerDetails, OrderItemsTable)
│   │   │   ├── new/          # Admin/Salesman manual order placement page (`/orders/new`)
│   │   │   └── page.tsx      # Admin orders table with "+ Create Order" action
│   │   ├── products/         # Product management
│   │   │   ├── [id]/         # Product View (`/products/[id]`) & Edit (`/products/[id]/edit`)
│   │   │   ├── new/          # Product Creation page (`/products/new`)
│   │   │   └── page.tsx      # Products listing page (URL-synced search/filter/pagination)
│   │   ├── salesmen/         # Salesman staff management
│   │   │   ├── [id]/         # Salesman detail/edit view (permissions, status toggle button)
│   │   │   ├── new/          # Salesman creation form (name, email, password, permissions checklist)
│   │   │   └── page.tsx      # Paginated salesmen list (URL-synced search, email column, status badges)
│   │   ├── settings/         # Settings & Staff Profile page with AdminNotificationToggle
│   │   ├── users/            # Retailer user management
│   │   │   ├── [id]/         # Retailer user detail view (profile, saved addresses, order history)
│   │   │   └── page.tsx      # Paginated retailer accounts table with search
│   │   ├── layout.tsx        # Dashboard layout with unified collapsible Sidebar
│   │   └── page.tsx          # Overview / Dashboard metrics page
│   ├── globals.css           # Global Tailwind, base styles, and glassmorphism styling
│   └── layout.tsx            # Root layout configuring Query, Redux, Socket, NuqsAdapter & AdminNotificationListener
│
├── public/
│   └── firebase-messaging-sw.js # Admin FCM Background Service Worker
│
├── components/               # React Components
│   ├── category/             # Category domain components
│   ├── common/               # Shared dashboard & UI components
│   │   ├── CheckboxCard.tsx  # Styled checkbox wrapper for boolean feature flags
│   │   ├── ConfirmModal.tsx  # Accessible modal for destructive actions & form confirmation
│   │   ├── DataTable.tsx     # Generic paginated table with dynamic column width skeletons & row actions
│   │   ├── FormSection.tsx   # Card layout wrapper for grouping related form fields with titles & descriptions
│   │   ├── ImageUploader.tsx # Ultra-compact inline image tile strip (max 3 images, 3MB size limit)
│   │   ├── Input.tsx         # Reusable form text/number input primitive
│   │   ├── KeywordsInput.tsx # Tag/chip input component for search keywords
│   │   ├── PageFilters.tsx   # Filter bar with debounced search input, dropdowns, clear filters button
│   │   ├── PageHeader.tsx    # Header with page title, subtitle stats, and primary action button
│   │   ├── Pagination.tsx    # Smart ellipsis pagination control (`1 ... current ... total`)
│   │   ├── RowActions.tsx    # Table row action trigger menu (View, Edit, Delete)
│   │   ├── Select.tsx        # Custom accessible select dropdown component
│   │   ├── Sidebar.tsx       # Main dashboard navigation sidebar with role/permission filtering
│   │   ├── Skeleton.tsx      # Loading skeleton primitives matching actual column widths
│   │   └── Textarea.tsx      # Textarea component primitive
│   ├── order/                # Order creation & builder components
│   │   ├── CustomerSelector.tsx # Debounced customer search (>= 2 chars) with address dropdown preview
│   │   ├── ProductSelector.tsx  # Cached product search catalog with category filtering & quantity selector
│   │   └── OrderSummaryCard.tsx # Sticky real-time subtotal and total calculation, notes, and submit action
│   ├── product/              # Product domain components (ProductForm.tsx)
│   ├── salesman/             # Salesman domain components (SalesmanForm.tsx)
│   └── ui/                   # Low-level UI primitives (Button, Modal, etc.)
│
├── constants/                # App Constants
│   ├── api.ts                # Backend API routes mapping (including /admin/orders and /admin/products/catalog)
│   ├── product.constants.ts  # Product defaults and unit options constants
│   ├── routes.ts             # App router routing definitions (including ORDERS.NEW and SALESMEN routes)
│   └── storage.ts            # Local and session storage keys
│
├── hooks/                    # Reusable Custom React Hooks
│   ├── useAdminFcmLifecycle.ts # Admin FCM token lifecycle hook
│   ├── useAuth.ts            # Authentication profile queries, store hydration & role utilities
│   ├── useDebounce.ts        # Input debouncing hook
│   ├── useProductFilters.ts  # URL query parameter management for Products (`nuqs`)
│   └── useSalesmanFilters.ts # URL query parameter management for Salesmen (`nuqs`)
│
├── lib/                      # Core integration utilities
│   ├── firebase.ts           # Firebase client SDK initialization & Messaging helpers
│   ├── axiosInstance.ts      # Axios request interceptor and refresh token queue
│   ├── store.ts              # Redux store configurations & persist setup
│   ├── format.ts             # Currency and numeric format helpers
│   └── utils.ts              # Styling (cn/clsx/tailwind-merge) helper utilities
│
├── services/                 # Service & React Query hooks
│   ├── auth/                 # Auth API service & `useLogin` mutation hook
│   ├── category/             # Category API service & hooks
│   ├── notification/         # Notification API service & React Query hooks
│   ├── order/                # Order API service & hooks
│   ├── product/              # Product API service & React Query hooks
│   ├── salesman/             # Salesman API service & React Query hooks (`useSalesmen`, `useSalesman`, `useCreateSalesman`, `useUpdateSalesman`, `useToggleSalesmanStatus`)
│   ├── upload/               # Direct S3 upload service
│   └── user/                 # User API service & hooks
│
├── types/                    # TypeScript interfaces and enum declarations
│   ├── auth/                 # AuthUser, EStaffRole, STAFF_ROLE_LABELS, AuthState
│   ├── salesman.types.ts     # ISalesman, SalesmanPermission, SALESMAN_PERMISSION_LABELS
│   └── common.types.ts       # SidebarProps, PageFiltersProps, DataTable column types
│
└── schemas/                  # Zod validation schemas
    ├── auth.ts               # Login schema
    ├── product.ts            # Product create/edit schemas
    └── salesman.ts           # Salesman create/edit schemas
```

---

## 4. Unified Authentication & Role-Based Navigation

- **Unified Login (`/login`)**:
  - Unified entry point for all staff members (Admins and Salesmen).
  - Handles `useLogin` mutation, persists auth state via Redux, and hydrates user profile (`id`, `fullName`, `email`, `role`, `permissions`).
- **Dynamic Navigation Filtering (`Sidebar.tsx`)**:
  - Centralized navigation definitions in `navigation.ts` with metadata flags (`adminOnly`, `permission`).
  - Automatically filters sidebar links based on the authenticated staff member's role and permission array:
    - **Admins** have access to all tabs (Overview, Categories, Products, Orders, Notifications, Salesmen, Users, Settings).
    - **Salesmen** only see tabs permitted by their granular permissions (`category_management`, `product_management`, `order_management`, `user_management`), plus Overview and Settings. `Salesmen` and `Notifications` are hidden.
- **Settings & Profile (`/settings`)**:
  - Dynamically renders role badges (`Super Administrator`, `Sub Administrator`, `Salesman`) using `STAFF_ROLE_LABELS`.
  - Accessible to all staff for account viewing, push notification toggling, and logging out.

---

## 5. Salesman Management Module

- **Salesmen Directory (`/salesmen/page.tsx`)**:
  - Paginated table displaying Name, Email, Creation Date, and Status badge (`Active` / `Inactive`).
  - Search filter wired to URL query params using `useSalesmanFilters` (`nuqs`).
  - Quick row actions: View (`/salesmen/[id]`) and Edit. (Deletion flow intentionally omitted per business rules).
- **Salesman Create (`/salesmen/new/page.tsx`)**:
  - Centered form card (`max-w-4xl`) capturing Full Name, Email, Password, and a visual permissions selector.
  - Granular permissions with descriptive labels: Category Management, Product Management, Order Management, Create Orders (`order_create`), User Management.
  - Redirects back to `/salesmen` upon successful creation.
- **Salesman Edit & Status (`/salesmen/[id]/page.tsx`)**:
  - Edit salesman details and permissions with confirmation.
  - Direct status toggle button in the header card with confirmation modal for activating/deactivating accounts.
  - Redirects back to the salesmen list upon saving changes.

---

## 6. Manual Wholesale Order Creation Module (`/orders/new`)

- **Role & Permission Gated**: Accessible to Super/Sub Admins and Salesmen with the `order_create` permission.
- **Three-Step Order Builder Flow**:
  1. **Customer Selection (`CustomerSelector.tsx`)**:
     - Debounced customer lookup (`useUsersQuery`, enabled only when search query is at least 2 characters).
     - Selecting a customer automatically populates their saved delivery address dropdown with a detailed snapshot preview.
  2. **Product Catalog Search & Selection (`ProductSelector.tsx`)**:
     - Fast cached catalog search (`useProductCatalog` calling `GET /api/v1/admin/products/catalog`).
     - Query enabled only when searching (>= 2 chars) or selecting a category from the dropdown filter.
     - Interactive unit price preview, and quantity step counter (`+` / `-`).
  3. **Order Summary & Review (`OrderSummaryCard.tsx`)**:
     - Real-time subtotal, and grand total.
     - Optional delivery notes textarea.
     - Confirm modal review before submitting the final wholesale order.
- **Confirmation-First Placement**:
  - Triggers `useCreateAdminOrder` mutation (`POST /api/v1/admin/orders`).
  - Automatically redirects to the newly created order detail page (`/orders/[id]`).

---

## 7. Product Management & Form Workflow

- **Product Form (`ProductForm.tsx`)**:
  - Reusable component shared by `/products/new` and `/products/[id]/edit`.
  - Driven by `react-hook-form` + `zod` schema validation.
  - Supports detailed product fields:
    - **Basic Details**: Name, SKU Code (unique, uppercase), URL Slug, Category (Controller-wrapped `<Select>`), Stock status & count.
    - **Multi-Variant Pricing & Weights**: Dynamic weight (`grams` with `suffix="g"`, min 1g) and GBP price (`min 0.01`) variants with add/remove variant controls (minimum 1 variant required).
    - **Media & Meta**: Product Media (`ImageUploader.tsx`, min 1 image, max 3 images), Keywords tag selector (`KeywordsInput.tsx`), Related Products multi-select picker, and Active status toggle.
- **Pre-Validation & Safe Upload Workflow**:
  - Clicking "Save Changes" or "Create Product" runs form validation and opens `ConfirmModal`.
  - Upon user confirmation, **Pre-Validation** (`POST /api/v1/admin/products/pre-validate`) runs against the database _before_ uploading any files to AWS S3, ensuring SKU/Slug collisions or invalid category/related products fail immediately with user-friendly toast messages without creating orphaned images.
  - S3 image uploads (`uploadService.processFormImages`) only execute once pre-validation passes cleanly.
  - Modal automatically closes and resets loading state on errors.
- **Product Detail View (`/products/[id]/page.tsx`)**:
  - Responsive card layout displaying product metadata, SKU badge, stock status, category, Product Media gallery, and an itemized grid of all weight and price variants.

---

## 8. Category Management & Catalogue Visuals

- **Rich Visual Catalogue Schema**:
  - Categories hold `image` (AWS S3 URL string), `tagline` (up to 150 characters), and `description` (up to 1000 characters) alongside standard `name`, `slug`, and `isActive`.
- **Category Form Component (`CategoryForm.tsx`)**:
  - Two-column responsive layout (`max-w-6xl`) optimized to fit standard screens without unnecessary vertical scrolling.
  - **Left Column**: Visual Identity section with `<ImageUploader>` (single image hero cover banner) and `<CheckboxCard>` for the active/catalogue visibility toggle.
  - **Right Column**: Category Name, auto-generated URL Slug (with `toSlug`), Tagline (with live `${count}/150` character counter), Story/Description textarea (with live `${count}/1000` counter), and primary submit button.
- **S3 Upload & Folder Routing**:
  - Uses `uploadService.processFormImages(values.image, "categories")` to ensure category images are routed to AWS S3 `categories/pending` and confirmed into `categories/`.
- **Pages**:
  - `/categories/page.tsx`: Paginated table view featuring category thumbnail avatar image previews, sub-item taglines under category names, URL slugs, active status badges, and row action triggers.
  - `/categories/new/page.tsx`: Creation page managing S3 image upload before calling `createCategory`.
  - `/categories/[id]/edit/page.tsx`: Edit view pre-populating existing cover image, tagline, and story description.
  - `/categories/[id]/page.tsx`: Detail view displaying category banner avatar, italicized tagline quote, rich description box, and audit timestamps.

---

## 9. UI Component Library & Shared Controls

- **`ImageUploader.tsx` & Client Validation (`fileValidation.ts`)**:
  - Ultra-compact inline thumbnail strip (`w-20 h-20` / `w-24 h-24`) with inline `+ Add Image` tile button.
  - Enforces client-side constraints: max 3 images per product, 3MB per image, allowed types (`image/jpeg`, `image/png`, `image/webp`).
- **`DataTable.tsx` & Dynamic Skeletons (`Skeleton.tsx`)**:
  - Table rows support hover-visible action triggers (`RowActions.tsx`).
  - Skeletons calculate width dynamically based on column configurations for layout stability during data fetches.
- **`Pagination.tsx`**:
  - Smart ellipsis pagination rendering (`1 ... current ... total`).
  - Integrated with `isFetching` loading states.
- **Custom Input Primitives**:
  - Reusable `Input.tsx`, `Textarea.tsx`, `Select.tsx`, `CheckboxCard.tsx`, `KeywordsInput.tsx`, `ImageUploader.tsx`, and `FormSection.tsx`.

---

## 10. Price Lists & Customer-Specific Pricing Module

- **Role & Access Control**:
  - `Price Lists` navigation item is configured with `adminOnly: true`, restricting visibility and access exclusively to system Administrators (`superAdmin`, `subAdmin`).
- **Reusable Component Architecture**:
  - **`PriceListForm.tsx` (`src/components/common/PriceListForm.tsx`)**:
    - Unified form component shared across Create (`/price-lists/new`) and Edit (`/price-lists/[id]`).
    - Encapsulates name input, product table, base price reference, custom price numeric inputs, live price diff badges (`+€ / -€`), row deletion, and product modal triggers.
  - **`ProductModalPicker.tsx` (`src/components/common/ProductModalPicker.tsx`)**:
    - Declarative infinite scroll product selector powered by TanStack's `useInfiniteQuery` and `useDebounce`.
    - Automatically handles deduplication of product IDs and provides a clean "+ Add" / "Remove" interaction.
  - **`UserPriceListSection.tsx` (`src/components/user/UserPriceListSection.tsx`)**:
    - Standalone customer price list card and assignment modal on customer detail view (`/users/[id]`).
    - Uses lean price list query (`usePriceListsLeanQuery`) to display active assignments and allows quick updates via `useUpdateUserPriceListMutation`.
- **Pages & Routing**:
  - `/price-lists` (`page.tsx`): Paginated table of all price lists with products count, creation date, and search.
  - `/price-lists/new` (`page.tsx`): Streamlined create page delegating to `<PriceListForm />`.
  - `/price-lists/[id]` (`page.tsx`): Detail/edit page with `<QueryBoundary />`, `<PriceListForm />`, and `<ConfirmModal />` for permanent deletion.

---

## 11. Italian Localization & Format Validation

- **Phone Number Validation**:
  - Customer profile, saved addresses, checkout forms, and salesman/admin order placement strictly validate Italian landline and mobile numbers (`+39...`, `3[0-9]{8,9}`, `0[0-9]{5,10}`).
- **Invoice & Delivery Note Documents**:
  - PDF templates and invoice previews display Shelly Indian Foods Italian commercial credentials (Cremona CR, P.IVA / CF, contacts).

---

## 11. URL State Management (`nuqs`) & Filtering

- **Nuqs Integration**: `NuqsAdapter` wrapped in root `layout.tsx` for type-safe Next.js App Router URL search parameter synchronization.
- **Filters Hooks (`useProductFilters.ts`, `useSalesmanFilters.ts`)**:
  - Encapsulates `page`, `search`, and custom filter params using `useQueryState` and `useQueryStates`.
  - Configured with `shallow: true` and `history: "push"` for seamless browser back/forward history navigation without losing state on page reloads.
- **Controlled Page Filters Component (`PageFilters.tsx`)**:
  - Uses guarded `useDebounce` (500ms) for local input state (`debouncedValue !== searchQuery`) to eliminate unnecessary API requests while typing.
