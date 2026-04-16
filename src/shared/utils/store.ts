import type { Product } from '../types/common.types';

export type ProductSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'rating-desc';

export interface ProductFilters {
  query?: string;
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function slugifyCategory(value: string) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCategoryLabel(slug: string, products: Product[]) {
  return products.find((product) => slugifyCategory(product.category) === slug)?.category ?? slug;
}

export function getProductCategories(products: Product[]) {
  return Array.from(new Set(products.map((product) => product.category))).sort((a, b) =>
    a.localeCompare(b, 'es-MX')
  );
}

export function filterProducts(products: Product[], filters: ProductFilters) {
  const query = filters.query?.trim();
  const normalizedQuery = query ? normalizeText(query) : '';
  const normalizedCategory = filters.category ? normalizeText(filters.category) : '';

  return products.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      normalizeText(product.name).includes(normalizedQuery) ||
      normalizeText(product.description).includes(normalizedQuery) ||
      normalizeText(product.category).includes(normalizedQuery);

    const matchesCategory =
      !normalizedCategory || normalizeText(product.category) === normalizedCategory;

    const matchesMin = filters.minPrice == null || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice == null || product.price <= filters.maxPrice;

    return matchesQuery && matchesCategory && matchesMin && matchesMax;
  });
}

export function sortProducts(products: Product[], sort: ProductSortOption) {
  const sorted = [...products];

  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'es-MX'));
      break;
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      sorted.sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
        return b.reviews - a.reviews;
      });
      break;
  }

  return sorted;
}
