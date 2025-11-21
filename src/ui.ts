import ApiService from "./services/apiService.js";
import Product from "./models/Product.js";
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
  private currentSkip: number = 0;
  private readonly limit: number = 12;
  private currentCategory: string = "";
  private currentSearch: string = "";

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

    this.initializeEventListeners();
    this.loadCategories();
    this.loadProducts();
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
        <span class="product-card__brand">${product.brand}</span>
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

    return card;
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
