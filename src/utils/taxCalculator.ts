/**
 * Calculates the tax amount for a product based on its category
 * @param price - Price of the product
 * @param category - Category of the product
 * @returns The dollar amount of tax
 * @example
 * calculateTax(100, "groceries") // returns 3 (3% of $100)
 * calculateTax(100, "electronics") // returns 4.75 (4.75% of $100)
 */
export function calculateTax(price: number, category: string): number {
  const taxRate = category.toLowerCase() === "groceries" ? 0.03 : 0.0475;
  return price * taxRate;
}
