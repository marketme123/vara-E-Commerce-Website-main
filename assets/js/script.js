// ================================ SHOW NAVBAR ================================ //
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
// ================================ SWIPER CATEGORIES ================================ //
let swiperCategories = new Swiper(".categories-container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    350: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 24,
    },
  },
});

// ================================ SWIPER PRODUCTS ================================ //

let swiperProducts = new Swiper(".new-container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    350: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 40,
    },
    1400: {
      slidesPerView: 4,
      spaceBetween: 24,
    },
  },
});

// ================================ PRODUCTS TAB ================================ //

const tabs = document.querySelectorAll("[data-target]");
const tabContents = document.querySelectorAll("[content]");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = document.querySelector(tab.dataset.target);
    tabContents.forEach((tabContent) => {
      tabContent.classList.remove("active-tab");
    });
    target.classList.add("active-tab");

    tabs.forEach((tab) => {
      tab.classList.remove("active-tab");
    });
    tab.classList.add("active-tab");
  });
});

// ================================ IMAGE GALLERY ================================ //
function imgGallery() {
  const mainImg = document.querySelector(".detials-img"),
    smallImg = document.querySelectorAll(".detials-small-img");

  smallImg.forEach((img) => {
    img.addEventListener("click", function () {
      mainImg.src = this.src;
    });
  });
}
imgGallery();

// ================================ DETAILS TAB ================================ //
const detialTabs = document.querySelectorAll("[data-target]");
const detialContents = document.querySelectorAll("[content]");

detialTabs.forEach((detailTab) => {
  detailTab.addEventListener("click", () => {
    const target = document.querySelector(detailTab.dataset.target);
    detialContents.forEach((detialContent) => {
      detialContent.classList.remove("active-tab");
    });
    target.classList.add("active-tab");

    detialTabs.forEach((detailTab) => {
      detailTab.classList.remove("active-tab");
    });
    detailTab.classList.add("active-tab");
  });
});

// ================================ ADD TO CART ================================ //
const cartBtns = document.querySelectorAll('.cart-btn');

// Function to update the cart count in the header
const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('a[href="cart.html"] .count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
};

// Function to add item to cart
const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Check if product already in cart
    const existingProductIndex = cart.findIndex(item => item.title === product.title);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
};

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll('.action-btn.cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productItem = e.target.closest('.product-item');
        const product = {
            id: productItem.querySelector('.product-title').textContent, // Use title as a simple ID
            image: productItem.querySelector('.product-img.default').src,
            title: productItem.querySelector('.product-title').textContent,
            price: productItem.querySelector('.new-price').textContent,
            quantity: 1,
        };
        addToCart(product);
    });
});

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// ================================ RENDER CART PAGE ================================ //
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        const cartItemsContainer = document.getElementById('cart-items');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const updateCartPage = () => {
            cartItemsContainer.innerHTML = '';
            let subtotal = 0;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
            } else {
                cart.forEach(item => {
                    const price = parseFloat(item.price.replace(/[^0-9.-]+/g,""));
                    const itemTotal = item.quantity * price;
                    subtotal += itemTotal;

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${item.image}" alt="${item.title}" class="table-img"></td>
                        <td>
                            <h3 class="table-title">${item.title}</h3>
                        </td>
                        <td><span class="table-price">${item.price}</span></td>
                        <td><input type="number" value="${item.quantity}" class="quantity" data-id="${item.id}"></td>
                        <td><span class="table-subtotal">$${itemTotal.toFixed(2)}</span></td>
                        <td><i class="ri-delete-bin-line table-trash" data-id="${item.id}"></i></td>
                    `;
                    cartItemsContainer.appendChild(row);
                });
            }
            updateCartTotals(subtotal);
            addCartManagementListeners();
        };

        const addCartManagementListeners = () => {
            // Remove item
            document.querySelectorAll('.table-trash').forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart = cart.filter(item => item.id !== itemId);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartPage();
                    updateCartCount();
                });
            });

            // Update quantity
            document.querySelectorAll('.quantity').forEach(input => {
                input.addEventListener('change', (e) => {
                    const itemId = e.target.getAttribute('data-id');
                    const newQuantity = parseInt(e.target.value);
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const itemIndex = cart.findIndex(item => item.id === itemId);

                    if (itemIndex > -1 && newQuantity > 0) {
                        cart[itemIndex].quantity = newQuantity;
                    } else if (newQuantity <= 0) {
                        // Remove item if quantity is 0 or less
                        cart = cart.filter(item => item.id !== itemId);
                    }

                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartPage();
                    updateCartCount();
                });
            });
        };

        const updateCartTotals = (subtotal) => {
            const shipping = 10.00; // Example shipping cost
            const total = subtotal + shipping;
            // More specific selectors for cart totals
            document.querySelector('.cart-total-table tr:nth-child(1) .cart-total-price').textContent = `$${subtotal.toFixed(2)}`;
            document.querySelector('.cart-total-table tr:nth-child(2) .cart-total-price').textContent = `$${shipping.toFixed(2)}`;
            document.querySelector('.cart-total-table tr:nth-child(3) .cart-total-price').textContent = `$${total.toFixed(2)}`;
        };

        updateCartPage();
    }
});