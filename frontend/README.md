# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
frontend
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ queryClient.js
│  │  ├─ rootReducer.js
│  │  └─ store.js
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ hero.jpg
│  │  └─ react.svg
│  ├─ components
│  │  ├─ AnimatedRoutes.jsx
│  │  ├─ category
│  │  │  ├─ CategoryFilters.jsx
│  │  │  ├─ CategoryHero.jsx
│  │  │  ├─ CategoryLayout.jsx
│  │  │  └─ CategoryProducts.jsx
│  │  ├─ checkout
│  │  │  ├─ CheckoutHeader.jsx
│  │  │  ├─ OrderConfirmation.jsx
│  │  │  ├─ OrderSummary.jsx
│  │  │  ├─ PaymentMethods.jsx
│  │  │  ├─ ShippingForm.jsx
│  │  │  └─ StepHeader.jsx
│  │  ├─ common
│  │  │  ├─ Button.jsx
│  │  │  ├─ Loader.jsx
│  │  │  ├─ Modal.jsx
│  │  │  └─ StylishLoader.jsx
│  │  ├─ FlyingCartAnimation.jsx
│  │  ├─ form
│  │  │  ├─ AddressForm.jsx
│  │  │  ├─ BaseForm.jsx
│  │  │  ├─ ImageField.jsx
│  │  │  ├─ InputField.jsx
│  │  │  ├─ ProfileForm.jsx
│  │  │  └─ RadioField.jsx
│  │  ├─ home
│  │  │  ├─ BestSeller.jsx
│  │  │  ├─ BrandTrust.jsx
│  │  │  ├─ CategoryCard.jsx
│  │  │  ├─ FaqSection.jsx
│  │  │  ├─ Hero.jsx
│  │  │  ├─ NewArrivals.jsx
│  │  │  ├─ OfferBanner.jsx
│  │  │  ├─ ProductCard.jsx
│  │  │  ├─ ProductSections.jsx
│  │  │  ├─ Testimonials.jsx
│  │  │  └─ TrandingSection.jsx
│  │  ├─ layout
│  │  │  ├─ AppLayout.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ MobileBottomNav.jsx
│  │  │  ├─ MobileSidebar.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  └─ ProfileLayout.jsx
│  │  ├─ productDetails
│  │  │  ├─ ProductAccordion.jsx
│  │  │  ├─ ProductDescription.jsx
│  │  │  ├─ ProductGallery.jsx
│  │  │  ├─ ProductInfo.jsx
│  │  │  ├─ RelatedProduct.jsx
│  │  │  ├─ ReviewComment.jsx
│  │  │  └─ ReviewSection.jsx
│  │  ├─ SlideOutCart.jsx
│  │  └─ userProfile
│  │     ├─ Address.jsx
│  │     ├─ Orders.jsx
│  │     ├─ OrderTracker.jsx
│  │     ├─ ProfileHome.jsx
│  │     ├─ Settings.jsx
│  │     └─ Wishlist.jsx
│  ├─ features
│  │  ├─ auth
│  │  │  ├─ authSelectors.js
│  │  │  ├─ authSlice.js
│  │  │  └─ authThunk.js
│  │  ├─ cart
│  │  │  └─ Cart.slice.js
│  │  ├─ product
│  │  │  ├─ Product.slice.js
│  │  │  └─ productSelectors.js
│  │  ├─ ui
│  │  │  ├─ uiSelectors.js
│  │  │  └─ uiSlice.js
│  │  └─ wishlist
│  │     ├─ wishlistSelectors.js
│  │     └─ wishlistSlice.js
│  ├─ hooks
│  │  ├─ redux.js
│  │  ├─ useAuth.js
│  │  ├─ useCart.js
│  │  └─ useScrollDirection.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ AuthPage.jsx
│  │  ├─ Cart.jsx
│  │  ├─ Categories.jsx
│  │  ├─ Checkout.jsx
│  │  ├─ Home.jsx
│  │  ├─ ProductDetails.jsx
│  │  ├─ Shop.jsx
│  │  └─ UserProfile.jsx
│  ├─ routes
│  │  ├─ AppRoutes.jsx
│  │  ├─ ProfileRoutes.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ services
│  │  ├─ api.js
│  │  ├─ auth.service.js
│  │  ├─ order.service.js
│  │  ├─ payment.service.js
│  │  └─ product.service.js
│  └─ utils
│     ├─ constants.js
│     ├─ helpers.js
│     ├─ product.js
│     └─ storage.js
└─ vite.config.js

```