export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
}

export default class Product implements IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];

  constructor(data: IProduct) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.discountPercentage = data.discountPercentage;
    this.rating = data.rating;
    this.stock = data.stock;
    this.brand = data.brand || "No Brand";
    this.thumbnail = data.thumbnail;
    this.images = data.images;
  }

  displayDetails(): void {
    console.log("\n" + "=".repeat(60));
    console.log(`Product: ${this.title}`);
    console.log("=".repeat(60));
    console.log(`ID: ${this.id}`);
    console.log(`Brand: ${this.brand}`);
    console.log(`Category: ${this.category}`);
    console.log(`Description: ${this.description}`);
    console.log(`Price: $${this.price.toFixed(2)}`);
    console.log(`Discount: ${this.discountPercentage}%`);
    console.log(`Rating: ${this.rating}/5`);
    console.log(`Stock: ${this.stock} units`);
    console.log(`Thumbnail: ${this.thumbnail}`);
    console.log("=".repeat(60) + "\n");
  }

  getPriceWithDiscount(): number {
    const discountAmount = (this.price * this.discountPercentage) / 100;
    return this.price - discountAmount;
  }
}
