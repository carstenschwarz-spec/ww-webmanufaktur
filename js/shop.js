/* ============================================
   COIFFEUR LAVIE - SHOP JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initShop();
});

function initShop() {
    // Product data
    const products = {
        'clay-wax': {
            id: 'clay-wax',
            name: 'Clay Wax Ultra Strong',
            category: 'Styling',
            price: 18.90,
            size: '100ml',
            image: 'Bilder/Produktbilder/Haargel/CLAY_WAX_ULTRA_STRONG.jpeg',
            description: 'Maximaler Halt mit mattem Finish. Perfekt für strukturierte Styles und texturierte Looks. Die Clay-Formel sorgt für einen natürlichen, matten Look ohne zu verkleben.',
            reviews: 24
        },
        'fiber-gel-wax': {
            id: 'fiber-gel-wax',
            name: 'Fiber Gel Wax Ultra Strong',
            category: 'Styling',
            price: 19.90,
            size: '150ml',
            image: 'Bilder/Produktbilder/Haargel/FIBER_GEL_WAX_ULTRA_STRONG.jpeg',
            description: 'Flexibler Halt mit natürlichem Glanz. Für alle Haartypen geeignet. Die Fiber-Technologie ermöglicht ein einfaches Restylen während des Tages.',
            reviews: 18
        },
        'fiber-wax': {
            id: 'fiber-wax',
            name: 'Fiber Wax Ultra Strong',
            category: 'Styling',
            price: 17.90,
            size: '100ml',
            image: 'Bilder/Produktbilder/Haargel/FIBER_WAX_ULTRA_STRONG.jpeg',
            description: 'Starker Halt mit flexiblem Finish. Ideal für definierte Looks. Die elastischen Fasern geben dem Haar Textur und Struktur.',
            reviews: 31
        },
        'matte-paste': {
            id: 'matte-paste',
            name: 'Matte Paste Ultra Strong',
            category: 'Styling',
            price: 18.90,
            size: '100ml',
            image: 'Bilder/Produktbilder/Haargel/MATTE_PASTE_ULTRA_STRONG.jpeg',
            description: 'Komplett mattes Finish mit maximaler Haltkraft. Für moderne Styles und einen natürlichen Look. Ideal für kurze bis mittellange Haare.',
            reviews: 42
        },
        'styling-powder': {
            id: 'styling-powder',
            name: 'Swing Styling Powder',
            category: 'Styling',
            price: 14.90,
            size: '20g',
            image: 'Bilder/Produktbilder/Styling Powder/SWING_STYLING_POWDER.jpeg',
            description: 'Volumen & Textur mit mattierendem Finish. Leicht zu verteilen und unsichtbar im Haar. Perfekt für mehr Fülle und griffiges Styling.',
            reviews: 27
        },
        'hairspray': {
            id: 'hairspray',
            name: 'Hairspray Super Grip',
            category: 'Styling',
            price: 16.90,
            size: '400ml',
            image: 'Bilder/Produktbilder/Haarspray/HAIRSPRAY_SUPER_GRIP.jpeg',
            description: 'Starker Halt mit Keratin & Provitamin B5. Schützt und fixiert das Haar den ganzen Tag. Ohne zu verkleben und leicht ausbürstbar.',
            reviews: 36
        },
        'aftershave': {
            id: 'aftershave',
            name: 'After Shave Cream Cologne',
            category: 'Pflege',
            price: 24.90,
            size: '250ml',
            image: 'Bilder/Produktbilder/Aftershave/AFTER SHAVE CREAM COLOGNE (INTENSE UND ORIGINAL).jpeg',
            description: 'Beruhigt, kühlt und pflegt die Haut nach der Rasur. Erhältlich in Intense und Original. Schützt vor dem Austrocknen und beruhigt Hautirritationen.',
            reviews: 53
        }
    };

    // Shopping Cart
    let cart = JSON.parse(localStorage.getItem('lavieCart')) || [];

    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const productCards = document.querySelectorAll('.product-card');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const sortSelect = document.getElementById('sortProducts');
    const viewBtns = document.querySelectorAll('.view-btn');
    const productCount = document.getElementById('productCount');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const quickViewModal = document.getElementById('quickViewModal');
    const modalClose = document.getElementById('modalClose');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartClose = document.getElementById('cartClose');
    const floatingCart = document.getElementById('floatingCart');
    const cartCount = document.getElementById('cartCount');
    const cartBody = document.getElementById('cartBody');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Category Filter
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            filterProducts(category);
        });
    });

    // Price Range
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = this.value + '€';
            filterProducts();
        });
    }

    // Sort Products
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    // View Toggle
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const view = this.dataset.view;
            if (view === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });

    // Filter Products
    function filterProducts(category = null) {
        const activeCategory = category || document.querySelector('.category-btn.active')?.dataset.category || 'all';
        const maxPrice = parseFloat(priceRange?.value || 50);
        let visibleCount = 0;

        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardPrice = parseFloat(card.dataset.price);

            const categoryMatch = activeCategory === 'all' || cardCategory === activeCategory;
            const priceMatch = cardPrice <= maxPrice;

            if (categoryMatch && priceMatch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (productCount) {
            productCount.textContent = `${visibleCount} Produkt${visibleCount !== 1 ? 'e' : ''}`;
        }
    }

    // Sort Products
    function sortProducts(sortBy) {
        const cardsArray = Array.from(productCards);

        cardsArray.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const nameA = a.querySelector('.product-name').textContent;
            const nameB = b.querySelector('.product-name').textContent;

            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name':
                    return nameA.localeCompare(nameB);
                default:
                    return 0;
            }
        });

        cardsArray.forEach(card => {
            productsGrid.appendChild(card);
        });
    }

    // Quick View Modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            const product = products[productId];

            if (product) {
                document.getElementById('modalImage').src = product.image;
                document.getElementById('modalImage').alt = product.name;
                document.getElementById('modalCategory').textContent = product.category;
                document.getElementById('modalTitle').textContent = product.name;
                document.getElementById('modalReviews').textContent = `(${product.reviews} Bewertungen)`;
                document.getElementById('modalDescription').textContent = product.description;
                document.getElementById('modalPrice').textContent = formatPrice(product.price);
                document.getElementById('modalQty').value = 1;

                quickViewModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    quickViewModal?.addEventListener('click', function(e) {
        if (e.target === quickViewModal) {
            closeModal();
        }
    });

    function closeModal() {
        quickViewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Quantity Controls in Modal
    const qtyBtns = document.querySelectorAll('.qty-btn');
    const qtyInput = document.getElementById('modalQty');

    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            let currentQty = parseInt(qtyInput.value);

            if (this.classList.contains('minus') && currentQty > 1) {
                qtyInput.value = currentQty - 1;
            } else if (this.classList.contains('plus') && currentQty < 10) {
                qtyInput.value = currentQty + 1;
            }
        });
    });

    // Add to Cart Buttons
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCart(productId, 1);
        });
    });

    // Modal Add to Cart
    const modalAddBtn = document.querySelector('.modal-add-btn');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', function() {
            const productName = document.getElementById('modalTitle').textContent;
            const productId = Object.keys(products).find(key => products[key].name === productName);
            const qty = parseInt(document.getElementById('modalQty').value);

            if (productId) {
                addToCart(productId, qty);
                closeModal();
            }
        });
    }

    // Add to Cart Function
    function addToCart(productId, quantity) {
        const product = products[productId];
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        saveCart();
        updateCartUI();
        showToast(`${product.name} wurde hinzugefügt`);
    }

    // Remove from Cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    // Update Quantity
    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = Math.min(newQuantity, 10);
                saveCart();
                updateCartUI();
            }
        }
    }

    // Save Cart to LocalStorage
    function saveCart() {
        localStorage.setItem('lavieCart', JSON.stringify(cart));
    }

    // Update Cart UI
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update cart count
        cartCount.textContent = totalItems;

        // Update cart items
        if (cart.length === 0) {
            cartEmpty.style.display = 'block';
            cartItems.innerHTML = '';
        } else {
            cartEmpty.style.display = 'none';
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="price">${formatPrice(item.price)}</span>
                        <div class="cart-item-actions">
                            <div class="cart-item-qty">
                                <button class="cart-qty-minus" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span>${item.quantity}</span>
                                <button class="cart-qty-plus" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="cart-item-remove" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add event listeners to new buttons
            document.querySelectorAll('.cart-qty-minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) updateQuantity(id, item.quantity - 1);
                });
            });

            document.querySelectorAll('.cart-qty-plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) updateQuantity(id, item.quantity + 1);
                });
            });

            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeFromCart(this.dataset.id);
                });
            });
        }

        // Update totals
        cartSubtotal.textContent = formatPrice(totalPrice);
        cartTotal.textContent = formatPrice(totalPrice);
    }

    // Cart Sidebar
    floatingCart?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    function openCart() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Toast Notification
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Format Price
    function formatPrice(price) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    }

    // Initialize cart on load
    updateCartUI();

    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeCart();
        }
    });
}
