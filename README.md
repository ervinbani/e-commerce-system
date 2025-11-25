# E-Commerce System - TypeScript Advanced JavaScript Project

## 📋 Project Overview

A comprehensive e-commerce application built with TypeScript, demonstrating advanced JavaScript concepts, Object-Oriented Programming principles, and modern web development practices. The system integrates with the DummyJSON API to fetch and display products, implementing a fully functional shopping cart with checkout capabilities.

## 🚀 Features

- **Product Catalog**: Browse products with search and category filtering
- **Product Details**: View detailed product information with image galleries
- **Shopping Cart**: Add/remove items with quantity management and localStorage persistence
- **Checkout System**: Complete payment flow with credit card form and validation
- **Responsive Design**: Mobile-first approach with SCSS styling
- **Real-time Calculations**: Automatic discount and tax calculations
- **Toast Notifications**: User feedback for cart actions

## 🛠️ Technical Stack

- **TypeScript 5.9.3**: Static typing and advanced type features
- **Node.js**: JavaScript runtime for build tools
- **Sass/SCSS**: CSS preprocessor for modular styling
- **DummyJSON API**: RESTful API for product data
- **localStorage**: Client-side data persistence
- **ES6 Modules**: Modern module system

## 📁 Project Structure

```
e-commerce-system/
├── src/
│   ├── models/
│   │   ├── Product.ts          # Product class with IProduct interface
│   │   └── Cart.ts             # Shopping cart with localStorage
│   ├── services/
│   │   └── apiService.ts       # API communication layer (static methods)
│   ├── utils/
│   │   ├── discountCalculator.ts   # Discount calculation utility
│   │   ├── taxCalculator.ts        # Tax calculation utility
│   │   └── errorHandler.ts         # Custom error classes
│   ├── ui.ts                   # ProductUI class for DOM management
│   └── main.ts                 # Console application demo
├── styles/
│   └── main.scss               # Responsive SCSS styling
├── dist/                       # Compiled JavaScript output
├── index.html                  # Main HTML structure
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🔧 Installation & Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd e-commerce-system
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```
npm run build
```

4. **Open in browser**

- Open `index.html` in a web browser
- Or use a local development server

## 📝 Scripts

- `npm run build` - Compile TypeScript and SCSS
- `npm run build:ts` - Compile TypeScript only
- `npm run build:scss` - Compile SCSS only

## 💻 Core Components

### Product Class (`src/models/Product.ts`)

Implements the `IProduct` interface with properties for product data. Key methods:

- `displayDetails()`: Console output of product information
- `getPriceWithDiscount()`: Calculates final price after discount

### Cart Class (`src/models/Cart.ts`)

Manages shopping cart state with localStorage persistence. Features:

- Add/remove/update items
- Calculate subtotals, tax, and totals
- Persist cart data across browser sessions

### ApiService (`src/services/apiService.ts`)

Static methods for API communication:

- `getData()`: Fetch data from any endpoint
- `searchProducts()`: Search products by query
- `getProductsByCategory()`: Filter by category

### ProductUI Class (`src/ui.ts`)

Handles all DOM interactions and user events:

- Product grid rendering
- Modal management (product details, checkout)
- Shopping cart UI updates
- Form handling and validation

### Utility Functions

- **discountCalculator**: Returns dollar amount of discount
- **taxCalculator**: Calculates tax (4.75% default, 3% for groceries)
- **errorHandler**: Custom error classes (ApiError, NetworkError, ValidationError)

## 🎨 Styling

The project uses SCSS with a mobile-first responsive approach:

- **Breakpoints**: 480px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)
- **Animations**: Fade-in effects, slide-up modals
- **Components**: Modular styling for cards, modals, forms, cart

## 🔐 Error Handling

Comprehensive error management system:

- Custom error classes extending base `Error`
- Try-catch blocks for async operations
- User-friendly error messages
- Network error detection and handling

## 📊 Data Flow

1. **API Request** → ApiService fetches product data
2. **Data Transformation** → Raw JSON converted to Product instances
3. **UI Rendering** → ProductUI displays products in grid
4. **User Interaction** → Events trigger cart updates
5. **State Persistence** → Cart saves to localStorage
6. **Checkout Flow** → Modal captures payment data

## 🧪 Key TypeScript Features

- **Interfaces**: `IProduct`, `CartItem` for type safety
- **Classes**: OOP design with encapsulation
- **Access Modifiers**: `private`, `public` for data protection
- **Static Methods**: Utility functions without instantiation
- **Type Annotations**: Explicit typing throughout
- **ES Modules**: `import`/`export` with `.js` extensions
- **Strict Mode**: Enabled for maximum type safety

## 📱 Responsive Design

The UI adapts to different screen sizes:

- **Mobile**: Single column, stacked layout
- **Tablet**: Two-column product grid
- **Desktop**: Three-column grid with sidebar
- **Wide**: Four-column grid with expanded details

## 🔄 Asynchronous Operations

All API calls use async/await pattern:

```typescript
async loadProducts() {
  try {
    const data = await ApiService.getData('/products');
    // Process data...
  } catch (error) {
    // Handle error...
  }
}
```

## 💳 Checkout Features

- Credit card input formatting (automatic spacing)
- Expiry date formatting (MM/YY)
- CVV validation (numbers only)
- Order summary with itemized breakdown
- Payment simulation with confirmation

## 🎯 OOP Principles Implemented

1. **Encapsulation**: Private properties with public methods
2. **Abstraction**: Interface definitions separate from implementation
3. **Single Responsibility**: Each class has one clear purpose
4. **Modularity**: Reusable components and utilities

## 🐛 Troubleshooting

**TypeScript compilation errors:**

- Ensure `type: "module"` is set in `package.json`
- Check that imports include `.js` extensions
- Verify `tsconfig.json` has `verbatimModuleSyntax: true`

**SCSS compilation errors:**

- Install Sass globally: `npm install -g sass`
- Check file paths in build script

**API errors:**

- Verify network connection
- Check DummyJSON API status
- Review browser console for error messages

## 📈 Future Enhancements

- User authentication
- Product reviews and ratings
- Wishlist functionality
- Order history tracking
- Payment gateway integration
- Backend API implementation

## 📄 License

This project is for educational purposes as part of the TypeScript Advanced JavaScript curriculum.

---

## 🎓 Reflections

### Implementation of TypeScript Features and OOP Principles

This project extensively leverages TypeScript's advanced features to create a robust, type-safe e-commerce application. The implementation centers around well-defined interfaces like `IProduct` and `CartItem`, ensuring strict type checking throughout the codebase. Classes such as `Product`, `Cart`, and `ProductUI` demonstrate core OOP principles including encapsulation through private properties, inheritance from interfaces, and single responsibility design patterns.

The `Product` class implements the `IProduct` interface, providing a contract for product data structure while encapsulating business logic like discount calculations. The `Cart` class manages state with private properties and exposes only necessary public methods, demonstrating proper data hiding. Static methods in `ApiService` provide utility functions without requiring instantiation, showcasing efficient design patterns.

### Challenges and Solutions

The primary challenge was configuring TypeScript's ES module system with proper import/export syntax. Initially, the project used CommonJS-style imports which caused compilation errors with `verbatimModuleSyntax`. This was resolved by setting `"type": "module"` in `package.json` and ensuring all imports included `.js` extensions, despite working with `.ts` files.

Another significant challenge was managing localStorage persistence with TypeScript's strict typing. The solution involved serializing Product instances into plain objects before storage and reconstructing them upon retrieval, maintaining type safety throughout the process.

Implementing responsive UI with modal management required careful event listener setup and cleanup. By using a class-based approach in `ProductUI`, all event handlers were properly scoped and managed, preventing memory leaks and ensuring proper modal state management.

### Asynchronous Operations and Error Management

All API interactions utilize async/await patterns wrapped in comprehensive try-catch blocks. The custom error hierarchy (`ApiError`, `NetworkError`, `ValidationError`) extends JavaScript's base `Error` class, allowing specific error handling for different failure scenarios. Network errors are caught and transformed into user-friendly messages displayed via toast notifications.

The `ApiService` class centralizes all asynchronous operations, implementing consistent error handling across all API endpoints. This approach ensures that network failures, parsing errors, and API-specific issues are caught and handled gracefully, providing excellent user experience even when operations fail. The checkout flow simulates payment processing with deliberate delays, demonstrating proper handling of long-running asynchronous operations.
