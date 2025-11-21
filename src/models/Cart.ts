import Product from "../models/Product.js";
import { calculateTax } from "../utils/taxCalculator.js";

export interface CartItem {
  product: Product;
  quantity: number;
}

export default class Cart {
  private items: CartItem[] = [];
  private readonly STORAGE_KEY = "ecommerce_cart";

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Add item to cart
   */
  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

    this.saveToStorage();
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveToStorage();
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: number, quantity: number): void {
    const item = this.items.find((item) => item.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        this.saveToStorage();
      }
    }
  }

  /**
   * Get all items in cart
   */
  getItems(): CartItem[] {
    return this.items;
  }

  /**
   * Get total number of items
   */
  getItemCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get subtotal (sum of all products after discount)
   */
  getSubtotal(): number {
    return this.items.reduce((total, item) => {
      const priceAfterDiscount = item.product.getPriceWithDiscount();
      return total + priceAfterDiscount * item.quantity;
    }, 0);
  }

  /**
   * Get total tax amount
   */
  getTotalTax(): number {
    return this.items.reduce((total, item) => {
      const priceAfterDiscount = item.product.getPriceWithDiscount();
      const taxAmount = calculateTax(priceAfterDiscount, item.product.category);
      return total + taxAmount * item.quantity;
    }, 0);
  }

  /**
   * Get grand total (subtotal + tax)
   */
  getTotal(): number {
    return this.getSubtotal() + this.getTotalTax();
  }

  /**
   * Get total savings from discounts
   */
  getTotalSavings(): number {
    return this.items.reduce((total, item) => {
      const discount =
        (item.product.price * item.product.discountPercentage) / 100;
      return total + discount * item.quantity;
    }, 0);
  }

  /**
   * Clear all items from cart
   */
  clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  /**
   * Check if cart is empty
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Save cart to localStorage
   */
  private saveToStorage(): void {
    try {
      const cartData = this.items.map((item) => ({
        productData: {
          id: item.product.id,
          title: item.product.title,
          description: item.product.description,
          category: item.product.category,
          price: item.product.price,
          discountPercentage: item.product.discountPercentage,
          rating: item.product.rating,
          stock: item.product.stock,
          brand: item.product.brand,
          thumbnail: item.product.thumbnail,
          images: item.product.images,
        },
        quantity: item.quantity,
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }

  /**
   * Load cart from localStorage
   */
  private loadFromStorage(): void {
    try {
      const cartData = localStorage.getItem(this.STORAGE_KEY);
      if (cartData) {
        const parsedData = JSON.parse(cartData);
        this.items = parsedData.map((item: any) => ({
          product: new Product(item.productData),
          quantity: item.quantity,
        }));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      this.items = [];
    }
  }
}
