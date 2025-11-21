import ApiService from "./services/apiService.js";
import Product from "./models/Product.js";
import { calculateDiscount } from "./utils/discountCalculator.js";
import { calculateTax } from "./utils/taxCalculator.js";
import { ApiError, handleApiError, logError } from "./utils/errorHandler.js";

/**
 * Main application entry point
 */
async function main() {
  try {
    console.log("=".repeat(60));
    console.log("E-COMMERCE SYSTEM - Product Catalog");
    console.log("=".repeat(60));

    // Fetch products from API
    console.log("\nFetching products from API...\n");
    const response = await ApiService.getData("products?limit=5");

    // Create Product instances from API data
    const products: Product[] = response.products.map(
      (productData: any) => new Product(productData)
    );

    // Display each product with details and calculations
    products.forEach((product) => {
      product.displayDetails();

      // Calculate discount, tax, and final price
      const discountAmount = calculateDiscount(
        product.price,
        product.discountPercentage
      );
      const priceAfterDiscount = product.getPriceWithDiscount();
      const taxAmount = calculateTax(priceAfterDiscount, product.category);
      const finalPrice = priceAfterDiscount + taxAmount;

      console.log("PRICE BREAKDOWN:");
      console.log(`Original Price: $${product.price.toFixed(2)}`);
      console.log(
        `Discount (${product.discountPercentage}%): -$${discountAmount.toFixed(
          2
        )}`
      );
      console.log(`Price After Discount: $${priceAfterDiscount.toFixed(2)}`);
      console.log(
        `Tax (${
          product.category === "groceries" ? "3" : "4.75"
        }%): +$${taxAmount.toFixed(2)}`
      );
      console.log(`FINAL PRICE: $${finalPrice.toFixed(2)}`);
      console.log("=".repeat(60) + "\n");
    });

    // Demonstrate search functionality
    console.log("\n" + "=".repeat(60));
    console.log("SEARCHING FOR PRODUCTS: 'phone'");
    console.log("=".repeat(60));

    const searchResults = await ApiService.searchProducts("phone");
    console.log(`\nFound ${searchResults.total} products matching 'phone'\n`);

    // Display first 3 search results
    const searchProducts = searchResults.products
      .slice(0, 3)
      .map((productData: any) => new Product(productData));

    searchProducts.forEach((product: Product) => {
      console.log(`- ${product.title} ($${product.price})`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("Application completed successfully!");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    // Demonstrate error handling
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        handleApiError(new ApiError("Failed to fetch data from API", 500));
      } else {
        handleApiError(error);
      }
      logError(error, "main application");
    }
  }
}

// Run the application
main();
