/* =================================================================
                        ENHANCED E-COMMERCE SCRIPT
   ================================================================= */

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener("DOMContentLoaded", () => {
  /* ================================================
     INITIAL UI/SWIPER SETUP (FROM YOUR ORIGINAL FILE)
     ================================================ */
  const navMenu = document.getElementById("nav-menu");
  const navClose = document.getElementById("nav-close");
  const navToggle = document.getElementById("nav-toggle");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  // SWIPER CATEGORIES
  if (document.querySelector(".categories-container")) {
    new Swiper(".categories-container", {
      spaceBetween: 24,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        350: { slidesPerView: 2, spaceBetween: 24 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        992: { slidesPerView: 4, spaceBetween: 24 },
        1200: { slidesPerView: 6, spaceBetween: 24 },
      },
    });
  }

  // SWIPER NEW ARRIVALS
  if (document.querySelector(".new-container")) {
    new Swiper(".new-container", {
      spaceBetween: 24,
      loop: true,
      breakpoints: {
        576: { slidesPerView: 2, spaceBetween: 24 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1200: { slidesPerView: 4, spaceBetween: 40 },
      },
    });
  }
  
  // PRODUCT TABS
  const tabs = document.querySelectorAll("[data-target]");
  const tabContents = document.querySelectorAll("[content]");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.target);
      tabContents.forEach((tabContent) => tabContent.classList.remove("active-tab"));
      target.classList.add("active-tab");
      tabs.forEach((t) => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });
  });

  // DETAILS PAGE IMAGE GALLERY
  if (document.querySelector(".details-container")) {
    const mainImg = document.querySelector(".detials-img");
    const smallImgs = document.querySelectorAll(".detials-small-img");
    smallImgs.forEach((img) => {
      img.addEventListener("click", function () {
        mainImg.src = this.src;
      });
    });
  }

  /* ================================================
     CORE E-COMMERCE FUNCTIONALITY
     ================================================ */

  // --- STATE MANAGEMENT (using localStorage) ---
  const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
  const saveCart = (cart) => localStorage.setItem("cart", JSON.stringify(cart));
  const getWishlist = () => JSON.parse(localStorage.getItem("wishlist")) || [];
  const saveWishlist = (wishlist) => localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // --- UI UPDATE FUNCTIONS ---
  const updateHeaderCounts = () => {
    const cartCount = document.querySelector('a[href="cart.html"] .count');
    const wishlistCount = document.querySelector('a[href="whishlist.html"] .count');
    if (cartCount) cartCount.textContent = getCart().length;
    if (wishlistCount) wishlistCount.textContent = getWishlist().length;
  };

  // --- CART & WISHLIST ACTIONS ---
  const addToCart = (product) => {
    let cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += product.quantity;
    } else {
      cart.push(product);
    }
    saveCart(cart);
    updateHeaderCounts();
    alert(`${product.title} has been added to your cart!`);
  };

  const addToWishlist = (product) => {
    let wishlist = getWishlist();
    if (!wishlist.some(item => item.id === product.id)) {
      wishlist.push(product);
      saveWishlist(wishlist);
      updateHeaderCounts();
      alert(`${product.title} has been added to your wishlist!`);
    } else {
      alert(`${product.title} is already in your wishlist.`);
    }
  };

  // --- EVENT LISTENERS FOR PRODUCT CARDS & DETAILS PAGE ---
  const initializeProductListeners = () => {
    document.querySelectorAll(".product-item, .details-container").forEach(container => {
      // Add to Cart Listener
      const cartBtn = container.querySelector(".cart-btn, .details-action .btn");
      if (cartBtn) {
        cartBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const productEl = e.target.closest(".product-item, .details-container");
          const quantityInput = productEl.querySelector(".quantity");
          
          const product = {
            id: productEl.querySelector(".product-title, .details-title").textContent.trim(),
            title: productEl.querySelector(".product-title, .details-title").textContent.trim(),
            price: parseFloat(productEl.querySelector(".new-price").textContent.replace("$", "")),
            image: (productEl.querySelector(".product-img.default") || productEl.querySelector(".detials-img")).src,
            quantity: quantityInput ? parseInt(quantityInput.value) : 1,
          };
          addToCart(product);
        });
      }
      
      // Add to Wishlist Listener
      const wishlistBtn = container.querySelector('a[aria-label="Add to Wishlist"], .detials-action-btn');
       if(wishlistBtn) {
           wishlistBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const productEl = e.target.closest('.product-item, .details-container');
                const product = {
                    id: productEl.querySelector('.product-title, .details-title').textContent.trim(),
                    title: productEl.querySelector('.product-title, .details-title').textContent.trim(),
                    price: parseFloat(productEl.querySelector('.new-price').textContent.replace('$', '')),
                    image: (productEl.querySelector('.product-img.default') || productEl.querySelector('.detials-img')).src,
                    quantity: 1, // Wishlist doesn't need quantity but good to have
                };
                addToWishlist(product);
           });
       }
    });
  };

  /* ================================================
     PAGE-SPECIFIC RENDERING LOGIC
     ================================================ */

  // --- RENDER CART PAGE ---
  const renderCartPage = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cart = getCart();
    cartItemsContainer.innerHTML = ""; // Clear existing content

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
    } else {
      cart.forEach(item => {
        const itemTotal = item.quantity * item.price;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.title}" class="table-img"></td>
            <td><h3 class="table-title">${item.title}</h3></td>
            <td><span class="table-price">$${item.price.toFixed(2)}</span></td>
            <td><input type="number" value="${item.quantity}" min="1" class="quantity" data-id="${item.id}"></td>
            <td><span class="table-subtotal">$${itemTotal.toFixed(2)}</span></td>
            <td><i class="ri-delete-bin-line table-trash" data-id="${item.id}"></i></td>
        `;
        cartItemsContainer.appendChild(row);
      });
    }
    updateCartTotals();
    addCartManagementListeners();
  };
  
  const updateCartTotals = () => {
      const cart = getCart();
      const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      const shipping = 10.00; // Example fixed shipping
      const total = subtotal + shipping;
      
      const subtotalEl = document.querySelector('.cart-total-table tr:nth-child(1) .cart-total-price');
      const shippingEl = document.querySelector('.cart-total-table tr:nth-child(2) .cart-total-price');
      const totalEl = document.querySelector('.cart-total-table tr:nth-child(3) .cart-total-price');
      
      if(subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      if(shippingEl) shippingEl.textContent = `$${shipping.toFixed(2)}`;
      if(totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  };

  const addCartManagementListeners = () => {
    document.querySelectorAll(".table-trash").forEach(button => {
      button.addEventListener("click", (e) => {
        const itemId = e.target.getAttribute("data-id");
        let cart = getCart().filter(item => item.id !== itemId);
        saveCart(cart);
        renderCartPage();
        updateHeaderCounts();
      });
    });

    document.querySelectorAll("#cart-items .quantity").forEach(input => {
      input.addEventListener("change", (e) => {
        const itemId = e.target.getAttribute("data-id");
        const newQuantity = parseInt(e.target.value);
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex > -1 && newQuantity > 0) {
          cart[itemIndex].quantity = newQuantity;
        }
        saveCart(cart);
        renderCartPage();
      });
    });
  };

  // --- RENDER WISHLIST PAGE ---
  const renderWishlistPage = () => {
      const wishlistContainer = document.getElementById('wishlist-items');
      const wishlist = getWishlist();
      wishlistContainer.innerHTML = '';

      if (wishlist.length === 0) {
          wishlistContainer.innerHTML = '<tr><td colspan="6">Your wishlist is empty.</td></tr>';
      } else {
          wishlist.forEach(item => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td><img src="${item.image}" alt="${item.title}" class="table-img"></td>
                  <td><h3 class="table-title">${item.title}</h3></td>
                  <td><span class="table-price">$${item.price.toFixed(2)}</span></td>
                  <td><span class="table-stock">In Stock</span></td>
                  <td><a href="#" class="btn btn-sm wishlist-to-cart-btn" data-id="${item.id}">Add To Cart</a></td>
                  <td><i class="ri-delete-bin-line table-trash" data-id="${item.id}"></i></td>
              `;
              wishlistContainer.appendChild(row);
          });
      }
      addWishlistManagementListeners();
  };

  const addWishlistManagementListeners = () => {
    // Remove from wishlist
    document.querySelectorAll('#wishlist-items .table-trash').forEach(button => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            let wishlist = getWishlist().filter(item => item.id !== itemId);
            saveWishlist(wishlist);
            renderWishlistPage();
            updateHeaderCounts();
        });
    });
    
    // Add to cart from wishlist
    document.querySelectorAll('.wishlist-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const itemId = e.target.getAttribute('data-id');
            const wishlist = getWishlist();
            const itemToMove = wishlist.find(item => item.id === itemId);
            
            if (itemToMove) {
                addToCart(itemToMove); // Add to cart
                // Remove from wishlist
                const newWishlist = wishlist.filter(item => item.id !== itemId);
                saveWishlist(newWishlist);
                renderWishlistPage(); // Re-render the wishlist page
            }
        });
    });
  };

  // --- RENDER CHECKOUT PAGE ---
  const renderCheckoutPage = () => {
      const orderItemsContainer = document.getElementById('checkout-order-items');
      const subtotalEl = document.getElementById('checkout-subtotal');
      const totalEl = document.getElementById('checkout-total');
      const cart = getCart();
      orderItemsContainer.innerHTML = '';
      
      let subtotal = 0;
      cart.forEach(item => {
          const itemTotal = item.quantity * item.price;
          subtotal += itemTotal;
          const row = document.createElement('tr');
          row.innerHTML = `
              <td><img src="${item.image}" alt="" class="order-img"></td>
              <td>
                  <h3 class="table-title">${item.title}</h3>
                  <p class="table-quantity">x ${item.quantity}</p>
              </td>
              <td><span class="table-price">$${itemTotal.toFixed(2)}</span></td>
          `;
          orderItemsContainer.appendChild(row);
      });

      const total = subtotal; // Assuming free shipping as per the static HTML
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      totalEl.textContent = `$${total.toFixed(2)}`;
  };


  /* ================================================
     INITIALIZATION
     ================================================ */
  updateHeaderCounts();
  initializeProductListeners();
  
  if (document.getElementById("cart-items")) renderCartPage();
  if (document.getElementById("wishlist-items")) renderWishlistPage();
  if (document.getElementById("checkout-order-items")) renderCheckoutPage();

});
