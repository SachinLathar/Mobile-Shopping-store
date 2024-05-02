// Variables
const barsBtn = document.querySelector(".bars-btn");
const searchBtn = document.querySelector('.search-btn button');
const searchInput = document.querySelector('.search-input');
const cartBtn = document.querySelector(".cart-btn");
const detailsBtn = document.querySelector(".details-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const buyNowBtn = document.querySelector(".buy-now");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const checkoutItemsList = document.getElementById('checkout-items-list');
const totalAmount = document.getElementById('total-amount');
// Cart 
let cart = [];
// Buttons
let buttonsDOM = [];

// Getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}

// UI Class
class UI {

    displayProducts(products) {
        let result = "";
        products.forEach(product => {
            result +=`
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to cart 
                    </button>
                    <button class="details-btn" data-id=${product.id}>
                        <i class="fas fa-product-details"></i>
                        Details
                    </button>
                </div> 
                <h3>${product.title}</h3>
                <h4> ₹${product.price}</h4>
            </article>`;
        });
        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In cart";
                button.disabled = true;
            }
    
            button.addEventListener('click', (event) => {
                let cartItem = { ...Storage.getProduct(id), amount: 1 };
                cart = [...cart, cartItem];
                Storage.saveCart(cart);
                this.setCartValues(cart);
                this.addCartItem(cartItem);
                this.showCart();
            });
        });
    }
    getDetailsButtons() {
        const buttons = [...document.querySelectorAll(".details-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                const product = Storage.getProduct(productId);
                if (product) {
                    console.log("Product details:", product);
                } else {
                    console.error("Product not found");
                }
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.forEach(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="product"> 
            <div>
                <h4>${item.title}</h4>
                <h5> ₹${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">${item.amount}</p>
                <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`;
        cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }

    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic() {
        clearCartBtn.addEventListener("click", () => { this.clearCart(); });
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }

    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    buyNow() {
        cart = [];
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        if (button) {
            button.disabled = false;
            button.innerHTML = `<i class= "fas fa-shopping-cart"></i>add to cart`;
        }
    }

    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// Local Storage 
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProducts() {
        return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    
    // Setup app
    ui.setupApp();
    
    // Get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.getDetailsButtons(); // Call the method to handle details buttons
        ui.cartLogic();
    });

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm !== '') {
            const storedProducts = Storage.getProducts();
            const filteredProducts = storedProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );
            if (filteredProducts.length > 0) {
                ui.displayProducts(filteredProducts);
            } else {
                productsDOM.innerHTML = '<h3>No matching products found</h3>';
            }
        } else {
            const storedProducts = Storage.getProducts();
            ui.displayProducts(storedProducts);
        }
    });

   // Buy Now Button
    buyNowBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            console.error("Cart is empty, cannot proceed with buy now");
        return;
            }
    
        const cartData = {
            items: cart.map(item => ({ id: item.id, quantity: item.amount, price: item.price }))
     };
    
        const encodedCartData = encodeURIComponent(JSON.stringify(cartData));
    
        const checkoutURL = "checkout.html?cart=" + encodedCartData; // Updated URL
    
        swindow.location.href = "http://127.0.0.1:3000/checkout.html";
});
});
