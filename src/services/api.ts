import { products, orders } from './mockData';
import type { Product, Order } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProducts(): Promise<Product[]> {
  await delay(400);
  return products;
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await delay(200);
  return products.find((p) => p.id === id);
}

export async function fetchOrders(): Promise<Order[]> {
  await delay(400);
  return orders;
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
  await delay(200);
  return orders.find((o) => o.id === id);
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  await delay(300);
  const newProduct: Product = {
    ...product,
    id: `prod-${String(products.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  return newProduct;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  await delay(300);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Producto no encontrado');
  products[index] = { ...products[index], ...data };
  return products[index];
}

export async function deleteProduct(id: string): Promise<void> {
  await delay(200);
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) products.splice(index, 1);
}
