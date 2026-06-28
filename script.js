// ==========================================
// 1. COMPREHENSIVE MOCK DATABASE GENERATION
// ==========================================
const BASE_MOCK_IMAGE = "https://images.unsplash.com/photo-";
const CATEGORY_IMAGES = {
    Electronics: ["1526738549149-8e07eca6c147", "1505740420928-5e560c06d30e", "1546868871-7041f2a55e12", "1542751371-adc38448a05e", "1583394838336-acd977736f90", "1608248597481-496100c80836"],
    Fashion: ["1542291026-7eec264c27ff", "1523381210434-271e8be1f52b", "1434389677669-e08b4cac3105", "1607522370275-f14206abe5d3", "1539109136881-3be0616acf4b", "1515886657613-9f3515b0c78f"],
    "Home Appliances": ["1584622650111-993a426fbf0a", "1522335789203-aabd1fc54bc9", "1574269909862-7e1d70bb8078", "1556911220-e15b29be8c8f", "1581578731548-c64695cc6952"],
    Sports: ["1461896836934-ffe607ba8211", "1517649763962-0c623066013b", "1541534741688-6078c6bfb5c5", "1574629810360-7efbbe195018", "1508098682722-e99c43a406b2"],
    Beauty: ["1596462502278-27bfdc403348", "1522337360788-8b13df793f1f", "1608248597481-496100c80836", "1612817288484-6f916006741a", "1512496015851-a90fb38ba796"]
};

const ADJECTIVES = ["Premium", "Ultra-Modern", "Minimalist", "Elite", "Pro-Series", "Luxury", "Eco-Friendly", "Smart", "Classic"];
const NOUNS = {
    Electronics: ["Wireless Headphones", "Smart Watch", "Mechanical Keyboard", "Gaming Mouse", "4K Monitor", "Soundbar", "Power Bank", "VR Headset"],
    Fashion: ["Designer Jacket", "Tailored Blazer", "Canvas Sneakers", "Leather Boots", "Summer Dress", "Slim-Fit Chinos", "Luxury Sunglasses"],
    "Home Appliances": ["Air Purifier", "Espresso Machine", "Robotic Vacuum", "Blender Pro", "Digital Toaster", "Smart Humidifier"],
    Sports: ["Ergonomic Dumbbells", "Yoga Mat", "Running Shoes", "Carbon Bicycle", "Waterproof Backpack", "Smart Fitness Tracker"],
    Beauty: ["Hydrating Serum", "Organic Face Oil", "Matte Lipstick Set", "Jade Roller Kit", "Exfoliating Scrub", "Luxury Parfum"]
};

// Seedable Deterministic Data Array Generator
function buildProductDatabase() {
    const database = [];
    const categories = Object.keys(NOUNS);
    let globalId = 1;

    categories.forEach(category => {
        const productTypes = NOUNS[category];
        const imgPool = CATEGORY_IMAGES[category] || ["1441986300917-64674bd600d8"];
        
        productTypes.forEach((noun, idx) => {
            ADJECTIVES.forEach((adj, adjIdx) => {
                if (database.filter(p => p.category === category).length >= 11) return;
                
                const price = parseFloat((Math.random() * (450 - 15) + 15 + Math.random()).toFixed(2));
                const rating = parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1));
                const imgId = imgPool[(idx + adjIdx) % imgPool.length];
                
                database.push({
                    id: globalId++,
                    name: `${adj} ${noun}`,
                    price: price,
                    category: category,
                    image: `${BASE_MOCK_IMAGE}${imgId}?auto=format&fit=crop&w=500&q=80`,
                    rating: rating,
                    description: `Experience luxury performance with this state-of-the-art ${noun.toLowerCase()}. Designed specifically combining top-tier elements, durability, and modern minimalist design ethics. Perfect for elevating your daily routines efficiently.`
                });
            });
        });
    });
    return database;
}

const MASTER_PRODUCTS = buildProductDatabase();

// ==========================================
// 2. STATE MANAGER SYSTEM
// ==========================================
let state = {
    products: [...MASTER_PRODUCTS],
    cart: JSON.parse(localStorage.getItem('ss_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('ss_wishlist')) || [],
    recentlyViewed: JSON.parse(localStorage.getItem('ss_recent')) || [],
    currentCategory: 'all',
    searchTerm: '',
    sortBy: 'default',
    maxPrice: 2000,
    theme: localStorage.getItem('ss_theme') || 'light'
};

// ==========================================
// 3. INITIALIZATION & ENGINE PIPELINES
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    generateSkeletonLoaders();
    
    // Simulate real server loading delay latency
    setTimeout(() => {
        shuffleArray(state.products);
        runApplicationPipeline();
        document.getElementById('skeleton-grid').classList.add('hidden');
        document.getElementById('products-grid').classList.remove('hidden');
    }, 900);

    registerEventHandlers();
    updateCartUIBadge();
    updateWishlistUIBadge();
});

function runApplicationPipeline() {
    let filtered = [...state.products];

    // Filter Routine
    if (state.currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === state.currentCategory);
    }
    if (state.searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(state.searchTerm.toLowerCase()));
    }
    filtered = filtered.filter(p => p.price <= state.maxPrice);

    // Sorting Routine
    if (state.sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (state.sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (state.sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    renderProductGrid(filtered);
    renderRecentlyViewed();
}

// ==========================================
// 4. RENDERING & UI GENERATORS
// ==========================================
function renderProductGrid(items) {
    const grid = document.getElementById('products-grid');
    const msg = document.getElementById('no-products-msg');
    const countLabel = document.getElementById('products-count-msg');
    
    grid.innerHTML = '';
    countLabel.innerText = `Showing ${items.length} of ${MASTER_PRODUCTS.length} results`;

    if(items.length === 0) {
        grid.classList.add('hidden');
        msg.classList.remove('hidden');
        return;
    }
    msg.classList.add('hidden');
    grid.classList.remove('hidden');

    items.forEach(product => {
        const isInWishlist = state.wishlist.some(id => id === product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img-container">
                <span class="card-badge">${product.rating} <i class="fa-solid fa-star" style="color:#f59e0b"></i></span>
                <button class="wishlist-toggle ${isInWishlist ? 'active' : ''}" data-id="${product.id}" title="Add to Wishlist">
                    <i class="fa-${isInWishlist ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="card-info">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title" data-id="${product.id}">${product.name}</h3>
                <div class="card-rating">
                    ${generateStarsMarkup(product.rating)}
                    <span>(${Math.floor(product.rating * 12)})</span>
                </div>
                <div class="card-footer">
                    <span class="card-price">$${product.price.toFixed(2)}</span>
                    <button class="btn-icon-only add-cart-btn" data-id="${product.id}" title="Add to Cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function generateStarsMarkup(rating) {
    let markup = '';
    const full = Math.floor(rating);
    for(let i=1; i<=5; i++) {
        if(i <= full) markup += `<i class="fa-solid fa-star"></i>`;
        else if(i - rating < 1) markup += `<i class="fa-solid fa-star-half-stroke"></i>`;
        else markup += `<i class="fa-regular fa-star"></i>`;
    }
    return markup;
}

function generateSkeletonLoaders() {
    const skelGrid = document.getElementById('skeleton-grid');
    skelGrid.innerHTML = '';
    for(let i=0; i<8; i++) {
        skelGrid.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton-img"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text short"></div>
                <div class="skeleton-text" style="margin-top:auto; height:30px;"></div>
            </div>
        `;
    }
}

// ==========================================
// 5. INTERACTIVE SIDE DIALOG & DRAWER HANDLERS
// ==========================================
function updateCartUIBadge() {
    const count = state.cart.reduce((acc, obj) => acc + obj.qty, 0);
    document.getElementById('cart-count').innerText = count;
    document.getElementById('cart-drawer-count').innerText = count;
    
    // Draw Cart Contents
    const container = document.getElementById('cart-items-container');
    const checkoutTrigger = document.getElementById('checkout-trigger-btn');
    container.innerHTML = '';

    if (state.cart.length === 0) {
        container.innerHTML = `<div class="no-products"><i class="fa-solid fa-basket-shopping"></i><p>Your cart is empty</p></div>`;
        document.getElementById('cart-total-price').innerText = "$0.00";
        checkoutTrigger.disabled = true;
        return;
    }

    checkoutTrigger.disabled = false;
    let total = 0;
    
    state.cart.forEach(item => {
        const prod = MASTER_PRODUCTS.find(p => p.id === item.id);
        if(!prod) return;
        total += prod.price * item.qty;

        const row = document.createElement('div');
        row.className = 'drawer-item';
        row.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}">
            <div class="drawer-item-details">
                <h4 class="drawer-item-title">${prod.name}</h4>
                <span class="drawer-item-price">$${prod.price.toFixed(2)}</span>
                <div class="qty-controls">
                    <button class="qty-btn dec-qty" data-id="${prod.id}">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn inc-qty" data-id="${prod.id}">+</button>
                </div>
            </div>
            <button class="remove-item-btn" data-id="${prod.id}"><i class="fa-solid fa-trash-can"></i></button>
        `;
        container.appendChild(row);
    });

    document.getElementById('cart-total-price').innerText = `$${total.toFixed(2)}`;
}

function updateWishlistUIBadge() {
    document.getElementById('wishlist-count').innerText = state.wishlist.length;
    document.getElementById('wishlist-drawer-count').innerText = state.wishlist.length;

    const container = document.getElementById('wishlist-items-container');
    container.innerHTML = '';

    if (state.wishlist.length === 0) {
        container.innerHTML = `<div class="no-products"><i class="fa-solid fa-heart-crack"></i><p>Wishlist is empty</p></div>`;
        return;
    }

    state.wishlist.forEach(id => {
        const prod = MASTER_PRODUCTS.find(p => p.id === id);
        if(!prod) return;

        const row = document.createElement('div');
        row.className = 'drawer-item';
        row.innerHTML = `
            <img src="${prod.image}" alt="${prod.name}">
            <div class="drawer-item-details">
                <h4 class="drawer-item-title">${prod.name}</h4>
                <span class="drawer-item-price">$${prod.price.toFixed(2)}</span>
                <button class="btn btn-secondary btn-block margin-top-md add-cart-btn" data-id="${prod.id}" style="padding: 6px; font-size:0.8rem;">Move to Cart</button>
            </div>
            <button class="remove-wishlist-btn remove-item-btn" data-id="${prod.id}"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(row);
    });
}

function renderRecentlyViewed() {
    const section = document.getElementById('recent-showcase-section');
    const grid = document.getElementById('recent-grid');
    grid.innerHTML = '';

    if(state.recentlyViewed.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');

    state.recentlyViewed.forEach(id => {
        const product = MASTER_PRODUCTS.find(p => p.id === id);
        if(!product) return;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-info">
                <h3 class="card-title" data-id="${product.id}">${product.name}</h3>
                <div class="card-footer">
                    <span class="card-price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================================
// 6. EVENT ACTION HANDLERS & LOGIC
// ==========================================
function registerEventHandlers() {
    // Category Selector
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            e.target.classList.add('active');
            state.currentCategory = e.target.dataset.category;
            document.getElementById('current-category-title').innerText = e.target.innerText;
            runApplicationPipeline();
        });
    });

    // Filtering & Sorting Listeners
    document.getElementById('sort-select').addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        runApplicationPipeline();
    });

    const priceRange = document.getElementById('price-range');
    priceRange.addEventListener('input', (e) => {
        state.maxPrice = parseInt(e.target.value);
        document.getElementById('price-max-label').innerText = `$${state.maxPrice}`;
        runApplicationPipeline();
    });

    // Live Instant Keyboard Search Engine
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.searchTerm = e.target.value;
        runApplicationPipeline();
    });

    // Drawer Window Triggers
    setupToggle('cart-btn', 'close-cart', 'cart-overlay');
    setupToggle('wishlist-btn', 'close-wishlist', 'wishlist-overlay');

    // Global Interactive Clicks Event Delegation
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // Add to Cart Trigger Action
        if (target.closest('.add-cart-btn')) {
            const id = parseInt(target.closest('.add-cart-btn').dataset.id);
            modifyCartQuantity(id, 1);
            showToast("Added to your shopping cart!");
        }

        // Wishlist Toggle Logic
        if (target.closest('.wishlist-toggle')) {
            const btn = target.closest('.wishlist-toggle');
            const id = parseInt(btn.dataset.id);
            toggleWishlistState(id, btn);
        }

        if (target.closest('.remove-wishlist-btn')) {
            const id = parseInt(target.closest('.remove-wishlist-btn').dataset.id);
            state.wishlist = state.wishlist.filter(item => item !== id);
            saveAndRefreshWishlist();
            showToast("Removed from wishlist", true);
        }

        // Cart Actions inside Drawer
        if (target.classList.contains('inc-qty')) modifyCartQuantity(parseInt(target.dataset.id), 1);
        if (target.classList.contains('dec-qty')) modifyCartQuantity(parseInt(target.dataset.id), -1);
        if (target.closest('.remove-item-btn') && !target.closest('.remove-wishlist-btn')) {
            const id = parseInt(target.closest('.remove-item-btn').dataset.id);
            state.cart = state.cart.filter(item => item.id !== id);
            saveAndRefreshCart();
            showToast("Item removed from cart", true);
        }

        // Open Quick View Modal Dialog 
        if (target.classList.contains('card-title')) {
            const id = parseInt(target.dataset.id);
            openQuickViewModal(id);
        }
    });

    // Checkout Window System Trigger Action
    document.getElementById('checkout-trigger-btn').addEventListener('click', () => {
        document.getElementById('cart-overlay').classList.remove('open');
        openCheckoutModal();
    });

    document.getElementById('close-checkout').addEventListener('click', () => {
        document.getElementById('checkout-modal').classList.remove('open');
    });

    // Payment radio view styling state management toggle
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.pay-radio').forEach(lbl => lbl.classList.remove('active'));
            e.target.parentElement.classList.add('active');
            const fields = document.getElementById('card-details-fields');
            if(e.target.value === 'card') fields.classList.remove('hidden');
            else fields.classList.add('hidden');
        });
    });

    // Form Checkout Submission Pipeline Handling
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('checkout-modal').classList.remove('open');
        
        // Wipe local active cache cart system clear
        state.cart = [];
        saveAndRefreshCart();

        // Reveal order confirmed success splash screen window
        const refId = `#SS-${Math.floor(100000 + Math.random() * 900000)}`;
        document.getElementById('order-reference-id').innerText = refId;
        document.getElementById('success-modal').classList.add('open');
    });

    document.getElementById('success-close-btn').addEventListener('click', () => {
        document.getElementById('success-modal').classList.remove('open');
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleThemeMode);
    document.getElementById('hero-shop-now').addEventListener('click', () => {
        document.querySelector('.main-layout').scrollIntoView({ behavior: 'smooth' });
    });
}

function setupToggle(openId, closeId, overlayId) {
    document.getElementById(openId).addEventListener('click', () => document.getElementById(overlayId).classList.add('open'));
    document.getElementById(closeId).addEventListener('click', () => document.getElementById(overlayId).classList.remove('open'));
    document.getElementById(overlayId).addEventListener('click', (e) => {
        if(e.target.id === overlayId) document.getElementById(overlayId).classList.remove('open');
    });
}

// ==========================================
// 7. UTILITY LOGIC OPERATION ENGINES
// ==========================================
function modifyCartQuantity(id, delta) {
    const itemIndex = state.cart.findIndex(item => item.id === id);
    if(itemIndex > -1) {
        state.cart[itemIndex].qty += delta;
        if(state.cart[itemIndex].qty <= 0) state.cart.splice(itemIndex, 1);
    } else if (delta > 0) {
        state.cart.push({ id, qty: 1 });
    }
    saveAndRefreshCart();
}

function toggleWishlistState(id, buttonEl) {
    const idx = state.wishlist.indexOf(id);
    if(idx > -1) {
        state.wishlist.splice(idx, 1);
        buttonEl.classList.remove('active');
        buttonEl.innerHTML = `<i class="fa-regular fa-heart"></i>`;
        showToast("Removed from wishlist", true);
    } else {
        state.wishlist.push(id);
        buttonEl.classList.add('active');
        buttonEl.innerHTML = `<i class="fa-solid fa-heart"></i>`;
        showToast("Added to your wishlist!");
    }
    saveAndRefreshWishlist();
}

function saveAndRefreshCart() {
    localStorage.setItem('ss_cart', JSON.stringify(state.cart));
    updateCartUIBadge();
}

function saveAndRefreshWishlist() {
    localStorage.setItem('ss_wishlist', JSON.stringify(state.wishlist));
    updateWishlistUIBadge();
    runApplicationPipeline();
}

function openQuickViewModal(id) {
    const prod = MASTER_PRODUCTS.find(p => p.id === id);
    if(!prod) return;

    // Push into recently viewed context tracker state array
    state.recentlyViewed = [id, ...state.recentlyViewed.filter(i => i !== id)].slice(0, 5);
    localStorage.setItem('ss_recent', JSON.stringify(state.recentlyViewed));

    const body = document.getElementById('quickview-body');
    body.innerHTML = `
        <img class="quickview-img" src="${prod.image}" alt="${prod.name}">
        <div class="quickview-info">
            <span class="card-category">${prod.category}</span>
            <h2>${prod.name}</h2>
            <div class="card-rating">${generateStarsMarkup(prod.rating)} <span>(${prod.rating})</span></div>
            <p class="quickview-desc">${prod.description}</p>
            <span class="price-accent" style="font-size:1.6rem; margin: 8px 0;">$${prod.price.toFixed(2)}</span>
            <button class="btn btn-primary add-cart-btn" data-id="${prod.id}"><i class="fa-solid fa-cart-shopping"></i> Add To Cart</button>
        </div>
    `;

    const modal = document.getElementById('quickview-modal');
    modal.classList.add('open');

    // Simple closure action listener bound contextually
    const closeView = () => { modal.classList.remove('open'); };
    document.getElementById('close-quickview').onclick = closeView;
    modal.onclick = (e) => { if(e.target === modal) closeView(); };
}

function openCheckoutModal() {
    const summaryContainer = document.getElementById('checkout-summary-items');
    summaryContainer.innerHTML = '';
    let runningTotal = 0;

    state.cart.forEach(item => {
        const prod = MASTER_PRODUCTS.find(p => p.id === item.id);
        if(!prod) return;
        runningTotal += prod.price * item.qty;

        summaryContainer.innerHTML += `
            <div class="summary-item-mini">
                <span>${prod.name} <strong>(x${item.qty})</strong></span>
                <span>$${(prod.price * item.qty).toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById('checkout-total-price').innerText = `$${runningTotal.toFixed(2)}`;
    document.getElementById('checkout-modal').classList.add('open');
}

function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'toast-error' : 'toast-success'}`;
    toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> ${message}`;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => toast.remove());
    }, 2500);
}

// ==========================================
// 8. LUXURY THEME ENHANCEMENT SUITE
// ==========================================
function initTheme() {
    document.body.setAttribute('data-theme', state.theme);
    const icon = document.querySelector('#theme-toggle i');
    if(state.theme === 'dark') icon.className = 'fa-solid fa-sun';
}

function toggleThemeMode() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('ss_theme', state.theme);
    document.body.setAttribute('data-theme', state.theme);
    document.querySelector('#theme-toggle i').className = state.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    showToast(`Switched to ${state.theme} mode!`);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}