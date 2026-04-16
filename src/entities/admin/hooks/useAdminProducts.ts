import { useCallback } from 'react';
import { useAdminProductsStore } from '../store/adminProductsStore';
import { productService } from '../services/productService';
import type { CreateProductInput, UpdateProductInput } from '../types/products.types';

export function useAdminProducts() {
  const {
    products,
    isLoading,
    error,
    setProducts,
    addProduct,
    updateProduct,
    removeProduct,
    setLoading,
    setError,
    getProductById,
  } = useAdminProductsStore();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.list();
      setProducts(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setProducts]);

  const createProduct = useCallback(
    async (input: CreateProductInput) => {
      const product = await productService.create(input);
      addProduct(product);
      return product;
    },
    [addProduct]
  );

  const editProduct = useCallback(
    async (id: string, input: UpdateProductInput) => {
      const updated = await productService.update(id, input);
      updateProduct(id, updated);
      return updated;
    },
    [updateProduct]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await productService.remove(id);
      removeProduct(id);
    },
    [removeProduct]
  );

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    editProduct,
    deleteProduct,
    getProductById,
  };
}
