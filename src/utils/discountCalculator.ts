/**
 * Calculates the dollar amount of discount for a product

 * calculateDiscount(100, 10) // returns 10 (10% of $100)
 */
export function calculateDiscount(
  price: number,
  discountPercentage: number
): number {
  return (price * discountPercentage) / 100;
}
