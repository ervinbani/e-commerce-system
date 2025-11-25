import ApiService from "./services/apiService.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";
import { calculateDiscount } from "./utils/discountCalculator.js";
import { calculateTax } from "./utils/taxCalculator.js";
import { logError } from "./utils/errorHandler.js";

class ProductUI {
  private productsGrid: HTMLElement;
  private searchInput: HTMLInputElement;
  private searchBtn: HTMLButtonElement;
  private categoryFilter: HTMLSelectElement;
  private loadMoreBtn: HTMLButtonElement;
  private loading: HTMLElement;
  private errorDiv: HTMLElement;
  private modal: HTMLElement;
  private modalOverlay: HTMLElement;
  private closeModalBtn: HTMLElement;
  private addToCartBtn: HTMLButtonElement;
  private buyNowBtn: HTMLButtonElement;
  private cartBtn: HTMLButtonElement;
  private miniCart: HTMLElement;
  private closeMiniCartBtn: HTMLElement;
  private checkoutBtn: HTMLButtonElement;
  private clearCartBtn: HTMLButtonElement;
  private checkoutModal: HTMLElement;
  private closeCheckoutModalBtn: HTMLElement;
  private checkoutForm: HTMLFormElement;
  private cancelCheckoutBtn: HTMLButtonElement;
  private cart: Cart;
  private currentSkip: number = 0;
  private readonly limit: number = 12;
  private currentCategory: string = "";
  private currentSearch: string = "";
  private selectedProduct: Product | null = null;

  constructor() {
    this.productsGrid = document.getElementById("productsGrid") as HTMLElement;
    this.searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
    this.searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;
    this.categoryFilter = document.getElementById(
      "categoryFilter"
    ) as HTMLSelectElement;
    this.loadMoreBtn = document.getElementById(
      "loadMoreBtn"
    ) as HTMLButtonElement;
    this.loading = document.getElementById("loading") as HTMLElement;
    this.errorDiv = document.getElementById("error") as HTMLElement;
    this.modal = document.getElementById("productModal") as HTMLElement;
    this.modalOverlay = this.modal.querySelector(
      ".modal__overlay"
    ) as HTMLElement;
    this.closeModalBtn = document.getElementById("closeModal") as HTMLElement;
    this.addToCartBtn = document.getElementById(
      "addToCartBtn"
    ) as HTMLButtonElement;
    this.buyNowBtn = document.getElementById("buyNowBtn") as HTMLButtonElement;
    this.cartBtn = document.getElementById("cartBtn") as HTMLButtonElement;
    this.miniCart = document.getElementById("miniCart") as HTMLElement;
    this.closeMiniCartBtn = document.getElementById(
      "closeMiniCart"
    ) as HTMLElement;
    this.checkoutBtn = document.getElementById(
      "checkoutBtn"
    ) as HTMLButtonElement;
    this.clearCartBtn = document.getElementById(
      "clearCartBtn"
    ) as HTMLButtonElement;
    this.checkoutModal = document.getElementById(
      "checkoutModal"
    ) as HTMLElement;
    this.closeCheckoutModalBtn = document.getElementById(
      "closeCheckoutModal"
    ) as HTMLElement;
    this.checkoutForm = document.getElementById(
      "checkoutForm"
    ) as HTMLFormElement;
    this.cancelCheckoutBtn = document.getElementById(
      "cancelCheckout"
    ) as HTMLButtonElement;
    this.cart = new Cart();

    this.initializeEventListeners();
    this.loadCategories();
    this.loadProducts();
    this.updateCartDisplay();
  }

  /**
   * Initialize event listeners
   */
  private initializeEventListeners(): void {
    this.searchBtn.addEventListener("click", () => this.handleSearch());
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    });
    this.categoryFilter.addEventListener("change", () =>
      this.handleCategoryFilter()
    );
    this.loadMoreBtn.addEventListener("click", () => this.handleLoadMore());

    // Modal event listeners
    this.closeModalBtn.addEventListener("click", () => this.closeModal());
    this.modalOverlay.addEventListener("click", () => this.closeModal());
    this.addToCartBtn.addEventListener("click", () => this.handleAddToCart());
    this.buyNowBtn.addEventListener("click", () => this.handleBuyNow());

    // ESC key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.closeModal();
      }
    });

    // Mini cart event listeners
    this.cartBtn.addEventListener("click", () => this.toggleMiniCart());
    this.closeMiniCartBtn.addEventListener("click", () => this.closeMiniCart());
    this.checkoutBtn.addEventListener("click", () => this.handleCheckout());
    this.clearCartBtn.addEventListener("click", () => this.handleClearCart());

    // Checkout modal event listeners
    this.closeCheckoutModalBtn.addEventListener("click", () =>
      this.closeCheckoutModal()
    );
    this.cancelCheckoutBtn.addEventListener("click", () =>
      this.closeCheckoutModal()
    );
    this.checkoutForm.addEventListener("submit", (e) =>
      this.handleCheckoutSubmit(e)
    );

    // Format card inputs
    this.setupCardInputFormatting();
  }

  /**
   * Display error message
   */
  private showError(message: string): void {
    this.errorDiv.style.display = "block";
    const errorMessage = this.errorDiv.querySelector(
      ".error__message"
    ) as HTMLElement;
    errorMessage.textContent = message;
  }

  /**
   * Hide error message
   */
  private hideError(): void {
    this.errorDiv.style.display = "none";
  }

  /**
   * Show loading spinner
   */
  private showLoading(): void {
    this.loading.style.display = "flex";
  }

  /**
   * Hide loading spinner
   */
  private hideLoading(): void {
    this.loading.style.display = "none";
  }

  /**
   * Create product card HTML
   */
  private createProductCard(product: Product): HTMLElement {
    const discountAmount = calculateDiscount(
      product.price,
      product.discountPercentage
    );
    const priceAfterDiscount = product.getPriceWithDiscount();
    const taxAmount = calculateTax(priceAfterDiscount, product.category);
    const finalPrice = priceAfterDiscount + taxAmount;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
    <img src="${product.thumbnail}" alt="${
      product.title
    }" class="product-card__image" />
    <div class="product-card__content">
      <span class="product-card__category">${product.category}</span>
      <h3 class="product-card__title">${product.title}</h3>
      <p class="product-card__description">${product.description}</p>
      
      <div class="product-card__details">
        <span class="product-card__brand">${product.brand || "No Brand"}</span>
        <span class="product-card__rating">⭐ ${product.rating}</span>
      </div>
      
      <div class="product-card__pricing">
        <span class="product-card__price">$${finalPrice.toFixed(2)}</span>
        ${
          product.discountPercentage > 0
            ? `<span class="product-card__original-price">$${product.price.toFixed(
                2
              )}</span>`
            : ""
        }
        ${
          product.discountPercentage > 0
            ? `<span class="product-card__discount">-${product.discountPercentage}% OFF</span>`
            : ""
        }
      </div>
      
      <p class="product-card__stock ${
        product.stock < 10 ? "product-card__stock--low" : ""
      }">
        ${product.stock < 10 ? "⚠️ " : ""}${product.stock} in stock
      </p>
    </div>
  `;

    // Add click event to open modal
    card.addEventListener("click", () => this.openModal(product));
    card.style.cursor = "pointer";

    return card;
  }

  /**
   * Open modal and display product details
   */
  private openModal(product: Product): void {
    this.selectedProduct = product;
    this.showProductDetails(product);
    this.modal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  /**
   * Close modal
   */
  private closeModal(): void {
    this.modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    this.selectedProduct = null;
  }

  /**
   * Display product details in modal
   */
  private showProductDetails(product: Product): void {
    const priceAfterDiscount = product.getPriceWithDiscount();
    const discountAmount = calculateDiscount(
      product.price,
      product.discountPercentage
    );
    const taxAmount = calculateTax(priceAfterDiscount, product.category);
    const finalPrice = priceAfterDiscount + taxAmount;
    const taxPercent =
      product.category.toLowerCase() === "groceries" ? "3%" : "4.75%";

    // Set main image
    const mainImage = document.getElementById(
      "modalMainImage"
    ) as HTMLImageElement;
    mainImage.src = product.thumbnail;
    mainImage.alt = product.title;

    // Set thumbnails
    const thumbnailsContainer = document.getElementById(
      "modalThumbnails"
    ) as HTMLElement;
    thumbnailsContainer.innerHTML = "";
    product.images.forEach((imageUrl: string, index: number) => {
      const thumb = document.createElement("div");
      thumb.className = `modal__thumbnail ${index === 0 ? "active" : ""}`;
      thumb.innerHTML = `<img src="${imageUrl}" alt="${product.title}" />`;
      thumb.addEventListener("click", () => {
        mainImage.src = imageUrl;
        thumbnailsContainer
          .querySelectorAll(".modal__thumbnail")
          .forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
      thumbnailsContainer.appendChild(thumb);
    });

    // Set product details
    (document.getElementById("modalCategory") as HTMLElement).textContent =
      product.category;
    (document.getElementById("modalTitle") as HTMLElement).textContent =
      product.title;
    (
      document.getElementById("modalRating") as HTMLElement
    ).textContent = `⭐ ${product.rating}`;
    (
      document.getElementById("modalRatingCount") as HTMLElement
    ).textContent = `(${product.rating} rating)`;
    (document.getElementById("modalBrand") as HTMLElement).textContent =
      product.brand;
    (document.getElementById("modalDescription") as HTMLElement).textContent =
      product.description;

    // Set pricing
    (
      document.getElementById("modalFinalPrice") as HTMLElement
    ).textContent = `$${finalPrice.toFixed(2)}`;
    (document.getElementById("modalOriginalPrice") as HTMLElement).textContent =
      product.discountPercentage > 0 ? `$${product.price.toFixed(2)}` : "";
    (
      document.getElementById("modalOriginalPrice") as HTMLElement
    ).style.display = product.discountPercentage > 0 ? "inline" : "none";

    const discountBadge = document.getElementById(
      "modalDiscountBadge"
    ) as HTMLElement;
    if (product.discountPercentage > 0) {
      discountBadge.textContent = `-${
        product.discountPercentage
      }% OFF - Save $${discountAmount.toFixed(2)}`;
      discountBadge.style.display = "inline-block";
    } else {
      discountBadge.style.display = "none";
    }

    // Price breakdown
    (
      document.getElementById("modalPriceOriginal") as HTMLElement
    ).textContent = `$${product.price.toFixed(2)}`;
    (
      document.getElementById("modalDiscountPercent") as HTMLElement
    ).textContent = `${product.discountPercentage}%`;
    (
      document.getElementById("modalDiscountAmount") as HTMLElement
    ).textContent = `-$${discountAmount.toFixed(2)}`;
    (
      document.getElementById("modalPriceAfterDiscount") as HTMLElement
    ).textContent = `$${priceAfterDiscount.toFixed(2)}`;
    (document.getElementById("modalTaxPercent") as HTMLElement).textContent =
      taxPercent;
    (
      document.getElementById("modalTaxAmount") as HTMLElement
    ).textContent = `$${taxAmount.toFixed(2)}`;
    (
      document.getElementById("modalPriceTotal") as HTMLElement
    ).textContent = `$${finalPrice.toFixed(2)}`;

    // Stock status
    const stockElement = document.getElementById("modalStock") as HTMLElement;
    stockElement.className = "modal__stock";
    if (product.stock === 0) {
      stockElement.textContent = "Out of Stock";
      stockElement.classList.add("out-of-stock");
      this.addToCartBtn.disabled = true;
      this.buyNowBtn.disabled = true;
    } else if (product.stock < 10) {
      stockElement.textContent = `⚠️ Only ${product.stock} left in stock - Order soon!`;
      stockElement.classList.add("low-stock");
      this.addToCartBtn.disabled = false;
      this.buyNowBtn.disabled = false;
    } else {
      stockElement.textContent = `✓ In Stock (${product.stock} available)`;
      stockElement.classList.add("in-stock");
      this.addToCartBtn.disabled = false;
      this.buyNowBtn.disabled = false;
    }

    // Additional info (safely handle missing properties)
    (document.getElementById("modalSku") as HTMLElement).textContent =
      (product as any).sku || "N/A";
    (document.getElementById("modalAvailability") as HTMLElement).textContent =
      (product as any).availabilityStatus || "Available";
    (document.getElementById("modalShipping") as HTMLElement).textContent =
      (product as any).shippingInformation || "Standard shipping";
    (document.getElementById("modalWarranty") as HTMLElement).textContent =
      (product as any).warrantyInformation || "No warranty";
    (document.getElementById("modalReturnPolicy") as HTMLElement).textContent =
      (product as any).returnPolicy || "30 days return";
  }

  /**
   * Handle add to cart button click
   */
  private handleAddToCart(): void {
    if (this.selectedProduct) {
      this.cart.addItem(this.selectedProduct, 1);
      this.showToast(`${this.selectedProduct.title} added to cart!`);
      this.updateCartDisplay();
      // Keep modal open so user can continue shopping
    }
  }

  /**
   * Handle buy now button click
   */
  private handleBuyNow(): void {
    if (this.selectedProduct) {
      this.cart.addItem(this.selectedProduct, 1);
      this.updateCartDisplay();
      this.closeModal();
      this.showToast(`Proceeding to checkout...`);
      setTimeout(() => this.handleCheckout(), 1000);
    }
  }

  /**
   * Update cart count badge and mini cart content
   */
  private updateCartDisplay(): void {
    const cartCount = document.getElementById("cartCount") as HTMLElement;
    cartCount.textContent = this.cart.getItemCount().toString();

    // Update mini cart items
    const miniCartItems = document.getElementById(
      "miniCartItems"
    ) as HTMLElement;
    const items = this.cart.getItems();

    if (items.length === 0) {
      miniCartItems.innerHTML = `
        <div class="mini-cart__empty">
          <p>🛒 Your cart is empty</p>
          <span>Start shopping to add items</span>
        </div>
      `;
      this.checkoutBtn.disabled = true;
    } else {
      miniCartItems.innerHTML = items
        .map(
          (item) => `
        <div class="cart-item" data-product-id="${item.product.id}">
          <img src="${item.product.thumbnail}" alt="${
            item.product.title
          }" class="cart-item__image" />
          <div class="cart-item__details">
            <h4 class="cart-item__title">${item.product.title}</h4>
            <p class="cart-item__price">$${item.product
              .getPriceWithDiscount()
              .toFixed(2)}</p>
            <div class="cart-item__quantity">
              <button class="qty-decrease" data-id="${
                item.product.id
              }">-</button>
              <span>${item.quantity}</span>
              <button class="qty-increase" data-id="${
                item.product.id
              }">+</button>
            </div>
          </div>
          <button class="cart-item__remove" data-id="${
            item.product.id
          }">×</button>
        </div>
      `
        )
        .join("");
      this.checkoutBtn.disabled = false;

      // Add event listeners for quantity buttons
      miniCartItems.querySelectorAll(".qty-decrease").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt((e.target as HTMLElement).dataset.id!);
          const item = items.find((i) => i.product.id === id);
          if (item) {
            this.cart.updateQuantity(id, item.quantity - 1);
            this.updateCartDisplay();
          }
        });
      });

      miniCartItems.querySelectorAll(".qty-increase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt((e.target as HTMLElement).dataset.id!);
          const item = items.find((i) => i.product.id === id);
          if (item) {
            this.cart.updateQuantity(id, item.quantity + 1);
            this.updateCartDisplay();
          }
        });
      });

      miniCartItems.querySelectorAll(".cart-item__remove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = parseInt((e.target as HTMLElement).dataset.id!);
          this.cart.removeItem(id);
          this.updateCartDisplay();
          this.showToast("Item removed from cart");
        });
      });
    }

    // Update summary
    (
      document.getElementById("cartSubtotal") as HTMLElement
    ).textContent = `$${this.cart.getSubtotal().toFixed(2)}`;
    (
      document.getElementById("cartTax") as HTMLElement
    ).textContent = `$${this.cart.getTotalTax().toFixed(2)}`;
    (
      document.getElementById("cartTotal") as HTMLElement
    ).textContent = `$${this.cart.getTotal().toFixed(2)}`;
  }

  /**
   * Toggle mini cart visibility
   */
  private toggleMiniCart(): void {
    this.miniCart.classList.toggle("active");
  }

  /**
   * Close mini cart
   */
  private closeMiniCart(): void {
    this.miniCart.classList.remove("active");
  }

  /**
   * Handle checkout button click
   */
  private handleCheckout(): void {
    if (!this.cart.isEmpty()) {
      this.closeMiniCart();
      this.openCheckoutModal();
    }
  }

  /**
   * Open checkout modal and populate order summary
   */
  private openCheckoutModal(): void {
    // Populate checkout items
    const checkoutItems = document.getElementById(
      "checkoutItems"
    ) as HTMLElement;
    const items = this.cart.getItems();

    checkoutItems.innerHTML = items
      .map(
        (item) => `
      <div class="checkout-item">
        <img src="${item.product.thumbnail}" alt="${
          item.product.title
        }" class="checkout-item__image" />
        <div class="checkout-item__details">
          <h4 class="checkout-item__title">${item.product.title}</h4>
          <p class="checkout-item__quantity">Qty: ${item.quantity}</p>
        </div>
        <span class="checkout-item__price">$${(
          item.product.getPriceWithDiscount() * item.quantity
        ).toFixed(2)}</span>
      </div>
    `
      )
      .join("");

    // Populate totals
    (
      document.getElementById("checkoutSubtotal") as HTMLElement
    ).textContent = `$${this.cart.getSubtotal().toFixed(2)}`;
    (
      document.getElementById("checkoutTax") as HTMLElement
    ).textContent = `$${this.cart.getTotalTax().toFixed(2)}`;
    (
      document.getElementById("checkoutSavings") as HTMLElement
    ).textContent = `-$${this.cart.getTotalSavings().toFixed(2)}`;
    (
      document.getElementById("checkoutTotal") as HTMLElement
    ).textContent = `$${this.cart.getTotal().toFixed(2)}`;

    // Show modal
    this.checkoutModal.classList.add("active");
    document.body.classList.add("modal-open");
  }

  /**
   * Close checkout modal
   */
  private closeCheckoutModal(): void {
    this.checkoutModal.classList.remove("active");
    document.body.classList.remove("modal-open");
    this.checkoutForm.reset();
  }

  /**
   * Handle checkout form submission
   */
  private handleCheckoutSubmit(e: Event): void {
    e.preventDefault();

    const formData = new FormData(this.checkoutForm);
    const cardNumber = formData.get("cardNumber") as string;
    const lastFour = cardNumber.replace(/\s/g, "").slice(-4);

    // Simulate payment processing
    this.showToast("Processing payment...");

    setTimeout(() => {
      // Success
      const orderSummary =
        `✅ Order Confirmed!\n\n` +
        `Card ending in ${lastFour}\n` +
        `Items: ${this.cart.getItemCount()}\n` +
        `Total: $${this.cart.getTotal().toFixed(2)}\n\n` +
        `Thank you for your purchase!`;

      alert(orderSummary);

      // Clear cart and close modal
      this.cart.clear();
      this.updateCartDisplay();
      this.closeCheckoutModal();
      this.showToast("Order completed successfully! 🎉");
    }, 2000);
  }

  /**
   * Setup card input formatting
   */
  private setupCardInputFormatting(): void {
    const cardNumber = document.getElementById(
      "cardNumber"
    ) as HTMLInputElement;
    const expiryDate = document.getElementById(
      "expiryDate"
    ) as HTMLInputElement;
    const cvv = document.getElementById("cvv") as HTMLInputElement;

    // Format card number
    cardNumber.addEventListener("input", (e) => {
      let value = (e.target as HTMLInputElement).value.replace(/\s/g, "");
      value = value.replace(/\D/g, "");
      const parts = value.match(/.{1,4}/g);
      (e.target as HTMLInputElement).value = parts ? parts.join(" ") : value;
    });

    // Format expiry date
    expiryDate.addEventListener("input", (e) => {
      let value = (e.target as HTMLInputElement).value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4);
      }
      (e.target as HTMLInputElement).value = value;
    });

    // Only numbers for CVV
    cvv.addEventListener("input", (e) => {
      (e.target as HTMLInputElement).value = (
        e.target as HTMLInputElement
      ).value.replace(/\D/g, "");
    });
  }

  /**
   * Handle clear cart button click
   */
  private handleClearCart(): void {
    if (confirm("Are you sure you want to clear your cart?")) {
      this.cart.clear();
      this.updateCartDisplay();
      this.showToast("Cart cleared");
    }
  }

  /**
   * Show toast notification
   */
  private showToast(message: string, isError: boolean = false): void {
    let toast = document.querySelector(".toast") as HTMLElement;

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = isError ? "toast error active" : "toast active";

    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  }

  /**
   * Load and display products
   */
  private async loadProducts(append: boolean = false): Promise<void> {
    try {
      this.showLoading();
      this.hideError();

      let endpoint = `products?limit=${this.limit}&skip=${this.currentSkip}`;

      if (this.currentSearch) {
        const searchData = await ApiService.searchProducts(this.currentSearch);
        this.displayProducts(searchData.products, append);
        this.hideLoading();
        return;
      }

      if (this.currentCategory) {
        endpoint = `products/category/${this.currentCategory}?limit=${this.limit}&skip=${this.currentSkip}`;
      }

      const response = await ApiService.getData(endpoint);
      this.displayProducts(response.products, append);
    } catch (error) {
      if (error instanceof Error) {
        this.showError(`Failed to load products: ${error.message}`);
        logError(error, "loadProducts");
      }
    } finally {
      this.hideLoading();
    }
  }

  /**
   * Display products in the grid
   */
  private displayProducts(productsData: any[], append: boolean = false): void {
    if (!append) {
      this.productsGrid.innerHTML = "";
    }

    if (productsData.length === 0) {
      this.productsGrid.innerHTML =
        '<p style="text-align: center; padding: 2rem; color: #6b7280;">No products found.</p>';
      this.loadMoreBtn.style.display = "none";
      return;
    }

    productsData.forEach((productData) => {
      const product = new Product(productData);
      const card = this.createProductCard(product);
      this.productsGrid.appendChild(card);
    });

    this.loadMoreBtn.style.display =
      productsData.length >= this.limit ? "block" : "none";
  }

  /**
   * Load categories for filter
   */
  private async loadCategories(): Promise<void> {
    try {
      const categories = await ApiService.getData("products/category-list");
      categories.forEach((category: string) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent =
          category.charAt(0).toUpperCase() + category.slice(1);
        this.categoryFilter.appendChild(option);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to load categories:", error);
      }
    }
  }

  /**
   * Handle search
   */
  private handleSearch(): void {
    this.currentSearch = this.searchInput.value.trim();
    this.currentSkip = 0;
    this.currentCategory = "";
    this.categoryFilter.value = "";
    this.loadProducts(false);
  }

  /**
   * Handle category filter
   */
  private handleCategoryFilter(): void {
    this.currentCategory = this.categoryFilter.value;
    this.currentSkip = 0;
    this.currentSearch = "";
    this.searchInput.value = "";
    this.loadProducts(false);
  }

  /**
   * Handle load more
   */
  private handleLoadMore(): void {
    this.currentSkip += this.limit;
    this.loadProducts(true);
  }
}

// Initialize the application
new ProductUI();
