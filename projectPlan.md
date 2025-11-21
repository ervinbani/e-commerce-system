# E-Commerce System - Project Plan

## Overview
Build a TypeScript e-commerce app that interacts with DummyJSON Products API using OOP, async/await, and error handling.

---

## API Research

**Base URL:** `https://dummyjson.com`

**Key Endpoints:**
- `GET /products` - Get all products
- `GET /products/{id}` - Get single product
- `GET /products/search?q={query}` - Search products
- `GET /products/category/{category}` - Filter by category

**Important Product Fields:**
- `id`, `title`, `description`, `category`, `price`
- `discountPercentage`, `rating`, `stock`, `brand`
- `thumbnail`, `images`

---

## Implementation Steps

### 1. Product Class (`src/models/Product.ts`)
- Define properties based on API response
- `displayDetails()` - Show product information
- `getPriceWithDiscount()` - Calculate final price after discount

### 2. Discount Calculator (`src/utils/discountCalculator.ts`)
```typescript
calculateDiscount(price: number, discountPercentage: number): number
// Returns dollar amount of discount
// Example: $100 with 10% = $10
```

### 3. Tax Calculator (`src/utils/taxCalculator.ts`)
```typescript
calculateTax(price: number, category: string): number
// Default: 4.75% tax
// Groceries: 3% tax
```

### 4. API Service (`src/services/apiService.ts`)
- `getData(endpoint)` - GET request
- `postData(endpoint, data)` - POST request
- `searchProducts(query)` - Search functionality
- Use async/await with try/catch

### 5. Error Handler (`src/utils/errorHandler.ts`)
- Custom error classes: `ApiError`, `NetworkError`, `ValidationError`
- Error handling functions with meaningful messages

### 6. Main Application (`src/main.ts`)
- Initialize ApiService with `https://dummyjson.com`
- Fetch products from API
- Create Product instances
- Display product details with price calculations
- Demonstrate error handling

---

## Testing & Compilation

**Compile:**
```bash
npx tsc
```

**Run:**
```bash
node dist/main.js
```

**Test Checklist:**
- [ ] API calls work correctly
- [ ] Discount calculator accurate
- [ ] Tax rates correct (4.75% default, 3% groceries)
- [ ] Error handling functional
- [ ] All TypeScript types defined

---

## Optional UI
- HTML product grid with search and filters
- CSS responsive styling
- Event listeners for user interactions

---

## Success Criteria
- Product class models API data correctly
- Calculations accurate (discount & tax)
- API service handles async operations
- Error handling catches failures gracefully
- Code compiles and runs without errors
