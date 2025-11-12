// Simple client-side product data, search, and cart logic.

const products = [
    // IMPORTANT: Added an 'images' array to support the 9-picture gallery on the product detail page.
    {
      id:1,
        title:'Grungecore Revival',
        color:'Cream,Washed Olive Green',
        price:149,
        img:'Grungecore1.png',
        desc:'An effortless grungecore look featuring an oversized, cream-colored graphic t-shirt paired with distressed, wide-leg olive denim jeans. The waist is cinched with a studded black leather belt, completing the edgy, relaxed streetwear aesthetic.',
        materials: 'Cotton, Cotton Denim, Leather, Metal Alloy',
        images: ['Grungecore1.png', 'Grungecore1.0.png', 'Grungecore2.png', 'Grungecore2.0.png']
    },
    { id:2, 
        title:'The Retro Boarder', 
        color:'Burnt', 
        price:139, 
        img:'Retro2.png', 
        desc:'Deep green wool blazer with elegant cut.',
        images: ['Retro2.png', 'Retro2.0.png', 'Retro1.png', 'Retro1.0.png']
    },

    { id:3, 
        title:'Minimalist Drape', 
        color:'Green/Gray', 
        price:169, 
        img:'Drape1.png', 
        desc:'Structured blazer with contrast trim.',
        images: ['Drape1.png', 'Drape1.0.png', 'Drape2.png', 'Drape2.0.png']
    },

    { id:4, 
        title:'Lemonade Stand Culotte', 
        color:'Gray', 
        price:129, 
        img:'Lemonade2.png', 
        desc:'Versatile charcoal jacket finished with subtle stitching.' ,
        images: ['Lemonade2.png', 'Lemonade2.0.png', 'Lemonade1.png', 'Lemonade1.0.png']
    },

    { id:5, 
        title:'Charcoal Utility Drop', 
        color:'Gray', 
        price:199, 
        img:'Charcoal1.png', 
        desc:'Long wool coat for cold days.' ,
        images: ['Charcoal1.png', 'Charcoal1.0.png', 'Charcoal2.png', 'Charcoal2.0.png']
    },

    { id:6, 
        title:'Cyber Shadow Shred', 
        color:'White', 
        price:79, 
        img:'Cyber2.png', 
        desc:'Crisp linen shirt for ultimate comfort.' ,
        images: ['Cyber2.png', 'Cyber2.0.png', 'Cyber1.png', 'Cyber1.0.png']
    },

    { id:7, 
        title:'Gridlock Slouch', 
        color:'Gray', 
        price:49, 
        img:'Gridlock1.png', 
        desc:'Elegant silk scarf.',
        images: ['Gridlock1.png', 'Gridlock1.0.png', 'Gridlock2.png', 'Gridlock2.0.png']

    },

    { id:8, 
        title:'Rave Baguette Academia', 
        color:'Gray', 
        price:89, 
        img:'Rave1.png', 
        desc:'Chunky knit sweater.',
        images: ['Rave1.png', 'Rave1.0.png', 'Rave2.png', 'Rave2.0.png'] 
    },

    { id:9, 
        title:'Lumberjack Campus Commander', 
        color:'Navy', 
        price:99, 
        img:'Lumberjack1.png', 
        desc:'Classic tailored trousers.',
        images: ['Lumberjack1.png', 'Lumberjack1.0.png', 'Lumberjack2.png', 'Lumberjack2.0.png'] 
    },

    { id:10, 
        title:'Boardroom Dropout Grunge', 
        color:'Black', 
        price:59, 
        img:'Dropout1.png', 
        desc:'Premium leather belt.',
         images: ['Dropout1.png', 'Dropout1.0.png', 'Dropout2.png', 'Dropout2.0.png']
    }

];

window.FAB_PRODUCTS = products;

// ==========================================================
// CART LOGIC
// ==========================================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('show');
});

window.addEventListener("scroll", function () {
  const nav = document.querySelector(".main-nav");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

function getCartItems() {
    try {
        const v = localStorage.getItem('fab_cart_items');
        return v ? JSON.parse(v) : [];
    } catch (e) {
        console.error("Error reading cart from localStorage:", e);
        return [];
    }
}

function saveCartItems(cart) {
    localStorage.setItem('fab_cart_items', JSON.stringify(cart));
    // Update the cart count badge everywhere
    const count = cart.length;
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
    // Re-render the cart page if the user is on it
    renderCart();
}

function addToCart(id, size = 'L', quantity = 1) {
    let cart = getCartItems();
    
    // Convert quantity to a number just in case it came from a string input
    const newQuantity = Number(quantity);

    // 1. Try to find an existing item with the same ID and SIZE
    const existingItemIndex = cart.findIndex(item => 
        item.id === id && item.size === size
    );

    if (existingItemIndex > -1) {
        // 2. If item exists, increase its quantity (and ensure it's checked)
        cart[existingItemIndex].quantity += newQuantity;
        cart[existingItemIndex].checked = true; // Ensure re-added item is selected
    } else {
        // 3. If item does NOT exist, add it as a new line item, DEFAULTING to CHECKED
        cart.push({ id, size, quantity: newQuantity, checked: true });
    }
    
    // Save the updated cart and flash the success message
    saveCartItems(cart);
    flashMessage('Added to cart');
}

function removeFromCart(id, size) {
    const cart = getCartItems();
    // Remove only the items that match both id and size
    const newCart = cart.filter(item => !(item.id === id && item.size === size));
    saveCartItems(newCart);
    flashMessage('Item removed');
}

function getCartDetails() {
    const cart = getCartItems();
    const cartDetails = [];
    const counts = {};

    // Use productId+size as key to handle multiple sizes
    cart.forEach(item => {
        const key = `${item.id}_${item.size}`;
        if (!counts[key]) counts[key] = { ...item, count: 0 };
        counts[key].count += item.quantity;
    });

    for (const key in counts) {
        const item = counts[key];
        const product = products.find(p => p.id === Number(item.id));
        if (product) {
            cartDetails.push({
                ...product,
                quantity: item.count,
                size: item.size,
                subtotal: product.price * item.count
            });
        }
    }

    return cartDetails;
}


// NOTE: processPurchase() and the old checkout() functions have been replaced.

/**
 * Handles the click of 'Proceed to Checkout', processes the purchase, 
 * clears the cart, and displays the success modal directly.
 */
/**
 * Handles the purchase process, clearing only selected items, 
 * and displaying the success modal directly.
 */
async function checkout() {
    let cart = getCartItems();
    
    // 1. Get ONLY the items the user has checked for purchase
    const selectedItems = cart.filter(item => item.checked);
    
    // 2. Check if any items are selected
    if (selectedItems.length === 0) {
        // Helpful message if they have items but none are checked
        if (cart.length > 0) {
            flashMessage('Please select at least one item to purchase!');
        } else {
            flashMessage('Your cart is empty. Nothing to check out!');
        }
        return;
    }
    
    // 3. Calculate total based ONLY on selected items
    const total = selectedItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    // 4. Confirmation Modal (Uses the custom modal and new total)
    const userAction = await showCustomModal(
        "Confirm Purchase",
        `Are you sure you want to proceed with the purchase of ${selectedItems.length} item(s) totaling $${total.toFixed(2)}?`,
        [
            { text: 'Confirm', className: 'primary-modal-btn' },
            { text: 'Cancel', className: 'secondary-modal-btn' }
        ]
    );

    if (userAction === 'Confirm') {
        // 5. Filter the cart: KEEP only items that were NOT selected (item.checked is false)
        const remainingItems = cart.filter(item => !item.checked);
        
        // 6. Save the remaining items to storage (this triggers renderCart() to update the display)
        saveCartItems(remainingItems); 

        // 7. Display the success modal
        showCustomModal(
            "You're all set",
            `Your purchase of $${total.toFixed(2)} was successful! The purchased items have been removed from your cart.`,
            // NOTE: I'm replacing your old success modal logic with the custom modal as we discussed previously
            [{ text: 'OK', className: 'primary-modal-btn', onClick: () => console.log('Purchase Confirmed') }]
        );
    } else {
        // If the user cancelled the purchase
        flashMessage('Checkout cancelled.');
    }
}


// ==========================================================
// UI Rendering Functions
// ==========================================================

// app.js

// ==========================================================
// UI Rendering Functions
// ==========================================================

// ==========================================================
// UI Rendering Functions - UPDATED FOR CHECKBOX SELECTION
// ==========================================================

function renderCart() {
    const el = document.getElementById('cart-items');
    if (!el) return;

    let cart = getCartItems();
    let total = 0;
    el.innerHTML = '';

    const summary = document.querySelector('.cart-summary');
    const checkoutBtn = summary ? summary.querySelector('.btn-primary') : null;

    if (cart.length === 0) {
        el.innerHTML = '<p>Your cart is currently empty.</p>';
        if (summary) {
            summary.querySelector('p').innerHTML = '<strong>Total:</strong> $0.00';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
        }
        return;
    }

    if (checkoutBtn) checkoutBtn.style.display = 'block';

    cart.forEach((item, index) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;

        // Ensure item.checked is initialized (defaults to true for legacy items)
        if (item.checked === undefined) {
            item.checked = true;
        }

        const subtotal = product.price * item.quantity;
        
        // ONLY include the subtotal in the main total if the item is checked
        if (item.checked) {
            total += subtotal;
        }

        // Apply a visual style if the item is NOT checked
        const itemStyle = item.checked ? '' : 'opacity: 0.6;'; 

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.style = itemStyle; // Apply the style here
        cartItem.innerHTML = `
            <input type="checkbox" class="purchase-checkbox" data-index="${index}" ${item.checked ? 'checked' : ''} style="margin-right: 15px; transform: scale(1.5);">
            <img src="${product.img}" alt="${product.title}">
            <div class="cart-details">
                <h4>${product.title}</h4>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>
                    Size: 
                    <select class="size-select" data-index="${index}">
                        <option ${item.size === 'S' ? 'selected' : ''}>S</option>
                        <option ${item.size === 'M' ? 'selected' : ''}>M</option>
                        <option ${item.size === 'L' ? 'selected' : ''}>L</option>
                        <option ${item.size === 'XL' ? 'selected' : ''}>XL</option>
                    </select>
                </p>
                <p>
                    Quantity: 
                    <input type="number" min="1" max="10" value="${item.quantity}" class="quantity-input" data-index="${index}" style="width: 60px; text-align: center;">
                </p>
            </div>
            <div class="cart-actions">
                <button class="remove-btn btn-link" data-index="${index}">Remove</button>
            </div>
            <div class="cart-subtotal" style="${item.checked ? '' : 'color: #999;'}">
                $${subtotal.toFixed(2)}
            </div>
        `;
        el.appendChild(cartItem);
    });

    // Update total
    if (summary) {
        summary.querySelector('p').innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;
    }
    
    // --- Event listeners (updated for checkboxes) ---

    // Standard Listeners (Remove, Size, Quantity) - Keep these as they are, but re-rendered
    el.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.index);
            const cart = getCartItems();
            cart.splice(idx, 1);
            saveCartItems(cart);
        });
    });

    el.querySelectorAll('.size-select').forEach(select => {
        select.addEventListener('change', () => {
            const idx = Number(select.dataset.index);
            const cart = getCartItems();
            cart[idx].size = select.value;
            saveCartItems(cart);
        });
    });

    el.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', () => {
            const idx = Number(input.dataset.index);
            const cart = getCartItems();
            const val = parseInt(input.value);
            cart[idx].quantity = val > 0 ? val : 1;
            saveCartItems(cart);
        });
    });
    
    // 🛑 NEW: Checkbox Listener
    el.querySelectorAll('.purchase-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const idx = Number(checkbox.dataset.index);
            const cart = getCartItems();
            // Update the 'checked' status of the item in the cart array
            cart[idx].checked = checkbox.checked;
localStorage.setItem('fab_cart_items', JSON.stringify(cart));

// Recalculate total manually without re-rendering everything
let total = 0;
cart.forEach((item, i) => {
  const product = products.find(p => p.id === item.id);
  if (item.checked && product) total += product.price * item.quantity;
});
const summary = document.querySelector('.cart-summary');
if (summary) {
  summary.querySelector('p').innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;
}

        });
    });
}

// Renders 6 FEATURED products (for index.html)
function renderFeatured(selector = '#featured-grid', count = 6) {
    const el = document.querySelector(selector);
    if(!el) return;
    el.innerHTML = '';

    products.slice(0, count).forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <a href="product.html?id=${p.id}" style="color:inherit;text-decoration:none">
                <img src="${p.img}" alt="${p.title}">
                <h4>${p.title}</h4>
                <p>${p.color}</p>
                <div class="price">$${p.price.toFixed(2)}</div>
            </a>
            <button class="add-btn btn-primary" data-id="${p.id}">Add to cart</button>
        `;
        el.appendChild(card);
    });
}

// Renders ALL products (for products.html)
function renderProductsGrid(selector = '#products-grid', list = products) {
    const el = document.querySelector(selector);
    if(!el) return;
    el.innerHTML = '';
    list.forEach(p => {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
            <a href="product.html?id=${p.id}" style="color:inherit;text-decoration:none">
                <img src="${p.img}" alt="${p.title}">
                <h4>${p.title}</h4>
                <p>${p.color}</p>
                <div class="price">$${p.price.toFixed(2)}</div>
            </a>
            <button class="add-btn btn-primary" data-id="${p.id}">Add to cart</button>
        `;
        el.appendChild(card);
    });
}


// Flash message helper
function flashMessage(text){
    const msg = document.createElement('div');
    msg.style.position = 'fixed';
    msg.style.right = '16px';
    msg.style.bottom = '20px';
    msg.style.background = '#fff';
    msg.style.padding = '10px 14px';
    msg.style.borderRadius = '8px';
    msg.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    msg.style.fontSize = '0.95rem';
    msg.style.transition = 'opacity 0.5s ease-in-out';
    msg.textContent = text;
    document.body.appendChild(msg);
    setTimeout(()=>msg.style.opacity = '0', 1800);
    setTimeout(()=>msg.remove(), 2600);
}

// Product detail page rendering (UPDATED FOR NEW LAYOUT AND BUTTONS)
// Product detail page rendering (UPDATED FOR NEW LAYOUT AND BUTTONS)
function renderProductDetail(){
    const container = document.getElementById('product-detail-container');
    const mainImageEl = document.getElementById('main-product-image');
    // 🛑 The original thumbnailGridEl here is now invalid after innerHTML is set. We'll re-select it later.
    const metaAreaEl = document.getElementById('product-meta-area');
    
    // Safety check for product page elements
    // Note: Removed check for thumbnailGridEl as it will be re-selected.
    if(!container || !mainImageEl || !metaAreaEl) return; 
    
    const params = new URLSearchParams(location.search);
    const id = Number(params.get('id'));
    // Find product or default to the first one
    const p = products.find(x=>x.id === id) || products[0];

    // NOTE: The populateThumbnails function is defined but unused. The logic is below.

    // --- 1. Populate Product Meta Data with New Format ---
    metaAreaEl.innerHTML = `
        <h1 style="font-family:'Playfair Display', serif; margin-bottom: 0; padding-right: 1%;">${p.title}</h1>
        
        <p style="color:#6b635c; margin-top: 5px; font-weight: 600;">made by unx</p>
        
        <div style="font-weight:700; margin-top: 12px; font-size: 1.4rem;margin-bottom: 15px;">
            $${p.price.toFixed(2)}
        </div>
        
        <h4 style="font-family:'Playfair Display', serif; "margin-top: 50px; font-size: 1.1rem;>Short Description:</h4>
        <p style="margin-top: 5px; line-height:1.6">${p.desc}</p>
        
        <div class="product-info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-top: 20px;">
            <p><strong>Materials:</strong> ${p.materials || 'N/A'}</p>
            <p><strong>Color:</strong> ${p.color}</p>
            <p><strong>Size:</strong> <select class="form-select-sm" style="width: auto; display: inline-block;">
                <option>S</option><option>M</option><option selected>L</option><option>XL</option>
            </select></p>
            <p><strong>Quantity:</strong> <input type="number" value="1" min="1" max="10" style="width: 60px; text-align: center; border: 1px solid #ccc; padding: 3px 5px;"></p>
        </div>
        
        <div id="thumbnail-grid" class="thumbnail-grid" style="margin-top: 25px;">
        </div>

        <div class="product-actions" style="margin-top: 30px; display: flex; gap: 15px;">
            <button class="btn-primary add-btn" data-id="${p.id}" style="padding: 12px 25px; font-size: 1rem; flex: 1;">
                Add to Cart
            </button>
          <button type="button" class="btn-secondary" style="padding: 12px 25px; font-size: 1rem; flex: 1;">
    Buy Now
</button>
        </div>
    `; 
    // 🛑 END OF innerHTML assignment

    // 🎯 RE-SELECT the element reference after it has been created in the DOM
    const thumbnailGridEl = document.getElementById('thumbnail-grid');
    if (!thumbnailGridEl) return;

    // --- 2. Populate Main Image and Thumbnails ---
    // Use the 'images' array if it exists and has content, otherwise default to the single 'img'
    const imageList = (p.images && p.images.length > 0) ? p.images : [p.img]; 
    
    // Set the initial main image
    mainImageEl.src = imageList[0];
    mainImageEl.alt = p.title;

    thumbnailGridEl.innerHTML = ''; // Clear existing content (should be empty anyway)
    

    // Create and append thumbnails
    imageList.forEach((imgSrc, index) => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `${p.title} thumbnail ${index + 1}`;
        img.dataset.fullSrc = imgSrc;
        
        // Highlight the first image as active
        if (index === 0) {
            img.classList.add('active');
        }

        // Add the click listener to change the main image
        img.addEventListener('click', function() {
            // Update the main image
            mainImageEl.src = this.dataset.fullSrc;
            
            // Remove 'active' class from all siblings
            thumbnailGridEl.querySelectorAll('img').forEach(i => i.classList.remove('active'));
            
            // Add 'active' class to the clicked image
            this.classList.add('active');
        });

        thumbnailGridEl.appendChild(img);
    });
}



// Search logic for products page
function wireSearch(searchInputSelector, gridSelector){
    const input = document.querySelector(searchInputSelector);
    if(!input) return;
    input.addEventListener('input', ()=>{
        const q = input.value.trim().toLowerCase();
        const filtered = products.filter(p=>{
            return p.title.toLowerCase().includes(q) ||
                        (p.color && p.color.toLowerCase().includes(q));
        });
        renderProductsGrid(gridSelector, filtered);
    });
}

// Sorting
function wireSort(selector){
    const s = document.getElementById('sort');
    if(!s) return;
    s.addEventListener('change', ()=>{
        const v = s.value;
        let list = [...products];
        if(v === 'price-asc') list.sort((a,b)=>a.price-b.price);
        if(v === 'price-desc') list.sort((a,b)=>b.price-a.price);
        if(v === 'name-asc') list.sort((a,b)=>a.title.localeCompare(b.title));
        renderProductsGrid('#products-grid', list);
    });
}

// Initialize common UI
function initCommon(){
    // Initialize cart count from the cart array size
    saveCartItems(getCartItems());

    const globalSearch = document.getElementById('global-search');
    if(globalSearch){
        globalSearch.addEventListener('keydown', (e)=>{
            if (e.key === 'Enter') {
                const q = globalSearch.value.trim();
                location.href = `products.html?q=${encodeURIComponent(q)}`;
            }
        });
    }

    const urlQ = new URLSearchParams(location.search).get('q');
    if(urlQ){
        const ps = document.getElementById('products-search');
        if(ps) { ps.value = urlQ; ps.dispatchEvent(new Event('input')) }
    }
}

// Main DOM Content Ready Block
document.addEventListener('DOMContentLoaded', ()=>{
    // Common mounts
    renderFeatured('#featured-grid', 6);
    renderProductsGrid('#products-grid', products);
    renderProductDetail();
    renderCart(); 

    initCommon();

    // Wire search inputs for each page
    wireSearch('#products-search', '#products-grid');
    wireSearch('#global-search', '#products-grid');

    wireSort('#sort');
  const checkoutButton = document.querySelector('.cart-summary .btn-primary');

    if (checkoutButton) {
        // FIX: Directly call checkout(). The checkout() function handles the cart checks, 
        // calculates the total, and presents the single, detailed confirmation modal.
        checkoutButton.addEventListener('click', () => { 
            checkout();
    });
}
  
    // Wires ALL buttons using a global listener
 document.body.addEventListener('click', e => {
    // Add to cart button
    if (e.target.classList.contains('add-btn')) {
        const id = Number(e.target.dataset.id);
        
        // --- Logic for the Product Detail Page button (which has size/qty selectors) ---
        const detailActionsContainer = e.target.closest('.product-actions');
        
        if (detailActionsContainer) {
            // This is the product detail page button, get its size and quantity
            const sizeSelect = detailActionsContainer.parentElement.querySelector('select');
            const quantityInput = detailActionsContainer.parentElement.querySelector('input[type="number"]');
            
            const size = sizeSelect ? sizeSelect.value : 'L';
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            addToCart(id, size, quantity);

        } else {
            // --- Logic for the Product Grid/Featured Grid button (quick-add) ---
            // If it's not inside a .product-actions container, assume default size and quantity.
            addToCart(id, 'L', 1);
        }
    }
    
    // ... rest of your listener logic (Buy Now, Remove button)
    


    // Buy Now button
    if (e.target.classList.contains('btn-secondary')) {
        const parent = e.target.closest('.product-actions');
        const addBtn = parent.querySelector('.add-btn');
        const id = Number(addBtn.dataset.id);
        const sizeSelect = parent.parentElement.querySelector('select');
        const quantityInput = parent.parentElement.querySelector('input[type="number"]');
        const size = sizeSelect ? sizeSelect.value : 'L';
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        // Overwrite cart with just this item
        const cart = [{ id, size, quantity }];
        localStorage.setItem('fab_cart_items', JSON.stringify(cart));

        // Redirect to cart
        window.location.href = 'cart.html';
    }

    // Remove button in cart
    if (e.target.classList.contains('remove-btn')) {
        const id = Number(e.target.dataset.id);
        const size = e.target.dataset.size;
        removeFromCart(id, size);
    }
});

    // --- Modal Event Listeners ---
    
    // Success Modal OK Button (Closes the 'You're all set' modal)
    const successModalOkButton = document.getElementById('modal-ok-button');
    if (successModalOkButton) {
        successModalOkButton.addEventListener('click', () => {
            const modal = document.getElementById('checkout-success-modal');
            modal.classList.remove('show');
        });
    }

    // REMOVED: Confirmation Modal Confirm Button listener
    // REMOVED: Confirmation Modal Cancel Button listener
    // Messenger and Browse button logic
    const messageBtn = document.getElementById('messageBtn');
    const messengerPopup = document.getElementById('messengerPopup');
    const closeBtn = document.getElementById('closeMessenger');
    const sendBtn = document.getElementById('sendBtn');
    const messageInput = document.getElementById('messageInput');
    const chatContent = document.getElementById('chatContent');
    const btnBrowse = document.getElementById('btnBrowse');

    if (messageBtn) messageBtn.addEventListener('click', () => {
        messengerPopup.style.visibility = 'visible';
    });

    if (closeBtn) closeBtn.addEventListener('click', () => {
        messengerPopup.style.visibility = 'hidden';
    });

    if (sendBtn) sendBtn.addEventListener('click', () => {
        const msg = messageInput.value.trim();
        if (msg !== '') {
            const msgDiv = document.createElement('div');
            msgDiv.textContent = msg;
            chatContent.appendChild(msgDiv);
            messageInput.value = '';
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    });

    if (messageInput) messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    if (btnBrowse) {
  btnBrowse.addEventListener('click', () => {
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
      const offset = sectionTitle.getBoundingClientRect().top + window.scrollY - 70; // adjust 70 if you have a fixed navbar
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  });
}
    /*
    if (btnBrowse) btnBrowse.addEventListener('click', () => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollTo({ top: scrollHeight - 1850, behavior: 'smooth' });
    });
*/
    
});

// app.js

/**
 * Displays a custom modal with dynamic content and buttons.
 * @param {string} title - The title for the modal.
 * @param {string} message - The message content for the modal.
 * @param {Array<Object>} buttons - An array of button configurations.
 * Each object: { text: string, className: string, onClick: Function }
 * @returns {Promise<string>} A promise that resolves with the text of the clicked button.
 */
function showCustomModal(title, message, buttons) {
    return new Promise(resolve => {
        const modal = document.getElementById('custom-modal');
        const modalTitle = document.getElementById('custom-modal-title');
        const modalMessage = document.getElementById('custom-modal-message');
        const modalButtonsContainer = document.getElementById('custom-modal-buttons');

        if (!modal || !modalTitle || !modalMessage || !modalButtonsContainer) {
            console.error("Custom modal elements not found.");
            // Fallback to a native alert if elements are missing
            alert(`${title}\n\n${message}`);
            resolve('Fallback_OK'); // Resolve with a default action for fallback
            return;
        }

        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalButtonsContainer.innerHTML = ''; // Clear previous buttons

        buttons.forEach(btnConfig => {
            const button = document.createElement('button');
            button.textContent = btnConfig.text;
            button.className = btnConfig.className;
            button.addEventListener('click', () => {
                modal.classList.remove('show');
                // Execute the button's specific action if provided
                if (btnConfig.onClick) {
                    btnConfig.onClick();
                }
                resolve(btnConfig.text); // Resolve the promise with the button's text
            });
            modalButtonsContainer.appendChild(button);
        });

        modal.classList.add('show');

        // Allow closing the modal by clicking outside
        modal.addEventListener('click', function handler(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                modal.removeEventListener('click', handler); // Clean up listener
                resolve('backdrop_click'); // Indicate modal was closed without explicit button
            }
        });
    });
}