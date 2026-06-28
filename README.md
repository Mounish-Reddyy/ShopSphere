# 🛒 ShopSphere | Complete Vanilla E-Commerce Platform


**ShopSphere** is a high-performance, fully responsive, production-grade e-commerce frontend web application built entirely using **pure vanilla web technologies**. The application features an automated, algorithmically generated data engine of over 50 products and mimics real-world enterprise architectures like Amazon and Flipkart—implemented completely without external frameworks, libraries, or backend APIs.

---

## 🌟 Key Features

### 🧠 Product Engine & Live State Management
* **Dynamic Dataset:** Ingests a mock database of 52 structured products across 5 master categories (*Electronics, Fashion, Home Appliances, Sports, Beauty*).
* **Algorithmic Shuffling:** Shuffles product displays deterministically upon every refresh to ensure high engagement with zero product duplication issues.
* **Instant Multi-Tier Filtering:** Real-time character-matching live search combined with dynamic sidebar filters for specific categories and sliding price thresholds.
* **Advanced Sorting:** Instant state sorting by *Price: Low to High*, *Price: High to Low*, and *Customer Ratings*.

### 🛒 E-Commerce Operations (Frontend-Only)
* **Persistent Cart & Wishlist System:** Full add/remove capabilities, dynamic quantity modifiers, and subtotal calculations that fully persist via `localStorage`.
* **Product Quick View Modal:** Triggers a comprehensive detail view overlay, dynamically feeding into a tracking array for a **Recently Viewed** contextual row carousel.
* **Secure Simulation Checkout:** Includes billing inputs, active toggle logic between Credit Card and Cash on Delivery UI layouts, dynamic order summary validation, and a custom order-reference generator confirmation screen.

### 🎨 Micro-UX Enhancements
* **Fluid Dark Mode Toggle:** State-aware theme switcher saving preferences across user sessions.
* **Skeleton Loader Layouts:** Custom CSS shimmer keyframe animations masking dynamic asset load latencies.
* **Toast Notifications:** Real-time event notifications detailing cart movements and system status updates.

---

## 📸 UI Design Architecture

* **SaaS-Level Elegance:** Utilizes a highly structured grid layout built around the modern **Inter** font family.
* **Glassmorphism Effects:** Uses modern `backdrop-filter` property configurations to achieve frosted-glass navigational overlays.
* **Micro-Interactions:** Custom linear gradients combined with cubic-bezier structural hover transformations on interactive cards and buttons.

---

## 📂 Project Architecture

The workspace is strictly isolated into three modular files to enforce standard clean separation of concerns:

```text
ShopSphere/
│
├── index.html   # Semantic layout structure, modal frameworks, and side drawer systems
├── style.css    # Central theme engine, utility classes, responsive breakpoints, and animations
└── script.js    # Data generator pipeline, filter/sort arrays, state handlers, and localStorage bridge
