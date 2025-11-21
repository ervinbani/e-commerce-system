export default class ApiService {
  private baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getData(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}`);
    }
    return response.json();
  }
  async postData(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error posting data to ${endpoint}`);
    }
    return response.json();
  }
  async putData(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error putting data to ${endpoint}`);
    }
    return response.json();
  }
  async deleteData(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error deleting data from ${endpoint}`);
    }
    return response.json();
  }

  /*  Search products
fetch('https://dummyjson.com/products/search?q=phone')
.then(res => res.json())
.then(console.log);
*/

  async searchProducts(query: string): Promise<any> {
    const response = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Error searching products with query ${query}`);
    }
    return response.json();
  }
}
