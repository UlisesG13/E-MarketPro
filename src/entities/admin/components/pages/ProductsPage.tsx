import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, X, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../../../entities/admin/hooks/useAdminProducts';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import { usePlanFeatures } from '../../../../shared/hooks/usePlanFeatures';
import { categoryService, type CategoriaDto } from '../../../../shared/services/categoryService';
import SearchBar from '../../../../shared/components/molecules/SearchBar';
import Button from '../../../../shared/components/atoms/Button';
import Input from '../../../../shared/components/atoms/Input';
import Spinner from '../../../../shared/components/atoms/Spinner';
import type { CreateProductInput, ProductoDTO } from '../../../../entities/admin/services/productService';
import { toast } from 'sonner';

const formatProductPrice = (value: number | null | undefined): string => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
  return `$${value.toFixed(2)}`;
};

const getCategoryName = (category: CategoriaDto): string => {
  return category.name;
};

const emptyForm: CreateProductInput = {
  nombre: '',
  descripcion: '',
  precio: 0,
  esta_activo: true,
  esta_destacado: false,
  categoria_id: 1,
};

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateProductInput>(emptyForm);

  const debouncedSearch = useDebounce(search, 400);

  // Fetch products from backend (no pagination support yet)
  const { data = [], isLoading, isFetching } = useAdminProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const { data: categories = [] } = useQuery<CategoriaDto[]>({
    queryKey: ['product-categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!modalOpen || categories.length === 0) return;
    const categoryExists = categories.some((c) => c.categoria_id === form.categoria_id);
    if (!categoryExists) {
      setForm((prev) => ({ ...prev, categoria_id: categories[0].categoria_id }));
    }
  }, [categories, form.categoria_id, modalOpen]);

  const { canAddMoreProducts } = usePlanFeatures();
  const totalItems = Array.isArray(data) ? data.length : 0;
  const canAdd = canAddMoreProducts(totalItems);

  // Client-side filtering
  const filtered = useMemo(() => {
    let result = Array.isArray(data) ? data : [];

    // Search filter
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(query) ||
          (p.descripcion?.toLowerCase() ?? '').includes(query)
      );
    }

    if (selectedCategoryId !== 'all') {
      result = result.filter((p) => p.categoria_id === selectedCategoryId);
    }

    return result;
  }, [data, selectedCategoryId, debouncedSearch]);

  const openCreate = () => {
    setEditProductId(null);
    setForm({
      ...emptyForm,
      categoria_id: categories[0]?.categoria_id ?? emptyForm.categoria_id,
    });
    setModalOpen(true);
  };

  const openEdit = (product: ProductoDTO) => {
    setEditProductId(product.producto_id);
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion ?? '',
      precio: typeof product.precio === 'number' ? product.precio : 0,
      esta_activo: product.esta_activo,
      esta_destacado: product.esta_destacado,
      categoria_id: product.categoria_id ?? 1,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (form.precio <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }
    if (!form.categoria_id) {
      toast.error('Selecciona una categoría');
      return;
    }

    try {
      if (editProductId) {
        await updateProduct.mutateAsync({ id: editProductId, data: form });
      } else {
        await createProduct.mutateAsync(form);
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text)]">Productos</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            {isFetching ? 'Actualizando...' : `${filtered.length} productos`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Filter className="w-4 h-4" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={
              canAdd
                ? openCreate
                : () =>
                  toast.warning(
                    'Límite de productos alcanzado. Actualiza tu plan.'
                  )
            }
            variant={canAdd ? 'primary' : 'outline'}
          >
            Nuevo
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar productos..."
      />

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4">
              <div>
                <p className="mb-2 text-xs text-[var(--app-text-muted)]">
                  Categoría
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    key="all-categories"
                    onClick={() => setSelectedCategoryId('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategoryId === 'all'
                        ? 'bg-[var(--app-primary)] text-white'
                        : 'bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category.categoria_id}
                      onClick={() => setSelectedCategoryId(category.categoria_id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategoryId === category.categoria_id
                          ? 'bg-[var(--app-primary)] text-white'
                          : 'bg-[var(--app-surface-soft)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-text)]'
                      }`}
                    >
                      {getCategoryName(category)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <motion.div
            key={product.producto_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
          >
            <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image placeholder */}
              <div className="aspect-square bg-[var(--app-surface-soft)] flex items-center justify-center">
                {product.imagenes?.[0]?.url ? (
                  <img
                    src={product.imagenes[0].url}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-[var(--app-text-muted)] opacity-20" />
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-[var(--app-text)] line-clamp-2">
                  {product.nombre}
                </h3>
                <p className="text-xs text-[var(--app-text-muted)]">
                  {categories.find((c) => c.categoria_id === product.categoria_id)?.name ?? 'Sin categoría'}
                </p>
                <p className="text-sm text-[var(--app-text-muted)] line-clamp-1">
                  {product.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-[var(--app-primary)]">
                    {formatProductPrice(product.precio)}
                  </p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="px-2 py-1 text-xs bg-[var(--app-primary-soft)] text-[var(--app-primary)] rounded hover:bg-[var(--app-primary)] hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.producto_id)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  {product.esta_activo && (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                      Activo
                    </span>
                  )}
                  {product.esta_destacado && (
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700">
                      Destacado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !isLoading && (
        <div className="text-center py-16 text-[var(--app-text-muted)]">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No hay productos. ¡Crea el primero!</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-6 shadow-[var(--app-shadow)]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--app-text)]">
                  {editProductId ? 'Editar producto' : 'Nuevo producto'}
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Nombre *"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
                <Input
                  label="Descripción"
                  value={form.descripcion ?? ''}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Precio (MXN) *"
                    type="number"
                    value={String(form.precio)}
                    onChange={(e) =>
                      setForm({ ...form, precio: Number(e.target.value) })
                    }
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-[var(--app-text)]">
                      Categoría *
                    </label>
                    <select
                      value={String(form.categoria_id)}
                      onChange={(e) =>
                        setForm({ ...form, categoria_id: Number(e.target.value) })
                      }
                      className="w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-2 text-sm text-[var(--app-text)] outline-none focus:border-[var(--app-primary)]"
                    >
                      {categories.map((category) => (
                        <option key={category.categoria_id} value={category.categoria_id}>
                          {getCategoryName(category)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.esta_activo}
                      onChange={(e) =>
                        setForm({ ...form, esta_activo: e.target.checked })
                      }
                    />
                    <span className="text-sm text-[var(--app-text)]">
                      Activo
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.esta_destacado}
                      onChange={(e) =>
                        setForm({ ...form, esta_destacado: e.target.checked })
                      }
                    />
                    <span className="text-sm text-[var(--app-text)]">
                      Destacado
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={
                    createProduct.isPending || updateProduct.isPending
                  }
                  className="flex-1"
                >
                  {createProduct.isPending || updateProduct.isPending
                    ? 'Guardando...'
                    : 'Guardar'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;
