import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Search, Eye, X, Film, Power, ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import type { Category, CategoryQueryParams } from '../../services/categoryService';
import { Modal } from '../../components/ui/Modal';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, type ToastType } from '../../components/ui/Toast';

interface FormErrors {
  name?: string;
  slug?: string;
  description?: string;
}

export const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Filter States
  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page: 1,
    limit: 5,
    search: '',
    status: 'all',
    sortBy: 'name',
    order: 'asc'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalItems: 0,
    totalPages: 1
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail Drawer State
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [categoryMovies, setCategoryMovies] = useState<any[]>([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);

  // Delete Confirm State
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Deletion Blocked Modal State
  const [blockedDeleteMessage, setBlockedDeleteMessage] = useState<string | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await categoryService.list(queryParams);
      setCategories(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error('Error al cargar categorías:', error);
      showToast('Error al cargar la lista de categorías', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: undefined }));
  };

  const handleOpenModal = (category?: Category) => {
    setFormErrors({});
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug || generateSlug(category.name),
        description: category.description || '',
        is_active: category.is_active !== undefined ? category.is_active : true
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
        showToast('Categoría actualizada exitosamente');
      } else {
        await categoryService.create(formData);
        showToast('Categoría creada exitosamente');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      console.error('Error guardando categoría:', error);
      const resData = error.response?.data;

      if (resData?.details) {
        setFormErrors(resData.details);
      } else if (resData?.error) {
        showToast(resData.error, 'error');
      } else {
        showToast('Ocurrió un error inesperado al procesar la categoría', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      const updated = await categoryService.toggleStatus(cat.id);
      setCategories(categories.map(c => c.id === cat.id ? { ...c, is_active: updated.is_active } : c));
      showToast(`Categoría "${cat.name}" ${updated.is_active ? 'activada' : 'desactivada'}`);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      showToast('No se pudo cambiar el estado de la categoría', 'error');
    }
  };

  const handleViewMovies = async (cat: Category) => {
    setViewingCategory(cat);
    setIsLoadingMovies(true);
    try {
      const slug = cat.slug || generateSlug(cat.name);
      const movies = await categoryService.getMovies(slug);
      setCategoryMovies(movies);
    } catch (error) {
      console.error('Error cargando películas:', error);
      showToast('Error al obtener películas de la categoría', 'error');
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.delete(deletingCategory.id);
      showToast(`Categoría "${deletingCategory.name}" eliminada`);
      setDeletingCategory(null);
      fetchCategories();
    } catch (error: any) {
      const resData = error.response?.data;
      setDeletingCategory(null);

      if (resData?.code === 'CATEGORY_IN_USE' || resData?.error) {
        setBlockedDeleteMessage(resData.error || 'No se puede eliminar la categoría porque está asociada a contenidos activos.');
      } else {
        showToast('Error inesperado al intentar eliminar la categoría', 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSort = (field: 'name' | 'movies_count' | 'is_active') => {
    setQueryParams(prev => ({
      ...prev,
      sortBy: field,
      order: prev.sortBy === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Categorías & Géneros</h1>
          <p className="text-text-secondary mt-1">Gestión integral de categorías con validaciones y auditoría</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-brand-red/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
        {/* Toolbar: Search, Filters & Limit */}
        <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar género o slug..."
              value={queryParams.search}
              onChange={(e) => setQueryParams(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary placeholder-gray-500 focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setQueryParams(prev => ({ ...prev, status: 'all', page: 1 }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${queryParams.status === 'all' ? 'bg-brand-red text-white' : 'bg-bg-tertiary text-text-secondary'}`}
              >
                Todas
              </button>
              <button
                onClick={() => setQueryParams(prev => ({ ...prev, status: 'active', page: 1 }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${queryParams.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
              >
                Activas
              </button>
              <button
                onClick={() => setQueryParams(prev => ({ ...prev, status: 'inactive', page: 1 }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${queryParams.status === 'inactive' ? 'bg-gray-700 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
              >
                Inactivas
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>Mostrar:</span>
              <select
                value={queryParams.limit}
                onChange={(e) => setQueryParams(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                className="bg-bg-tertiary border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-red"
              >
                <option value={5}>5 por pág.</option>
                <option value={10}>10 por pág.</option>
                <option value={25}>25 por pág.</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary text-text-secondary text-xs uppercase tracking-wider border-b border-gray-800">
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Categoría / Género <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold">Slug URL</th>
                <th 
                  onClick={() => handleSort('is_active')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Estado <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('movies_count')}
                  className="px-6 py-4 font-semibold cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    Películas <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                    Cargando información del servidor...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                    No se encontraron categorías asociadas a la búsqueda.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-bg-tertiary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-brand-red/10 text-brand-red rounded-xl shrink-0">
                          <FolderOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{cat.name}</span>
                          <span className="text-xs text-text-secondary line-clamp-1">{cat.description || 'Sin descripción.'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <code className="text-xs font-mono text-gray-400 bg-bg-tertiary px-2.5 py-1 rounded-md border border-gray-800">
                        /category/{cat.slug || generateSlug(cat.name)}
                      </code>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                          cat.is_active !== false
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-gray-800 text-gray-400 border-gray-700'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        {cat.is_active !== false ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewMovies(cat)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-colors"
                      >
                        <Film className="w-3.5 h-3.5" />
                        {cat.movies_count || 0} películas
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewMovies(cat)}
                          className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          title="Ver películas"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-2 text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Server-side Pagination Bar */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between text-xs text-text-secondary">
          <div>
            Mostrando <span className="font-bold text-white">{categories.length}</span> de <span className="font-bold text-white">{pagination.totalItems}</span> categorías
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQueryParams(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-gray-700 bg-bg-tertiary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-white">Página {pagination.page} de {pagination.totalPages}</span>
            <button
              onClick={() => setQueryParams(prev => ({ ...prev, page: Math.min(pagination.totalPages, (prev.page || 1) + 1) }))}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-gray-700 bg-bg-tertiary text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar con Validaciones Visuales */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Nombre del Género *</label>
              <input
                type="text"
                required
                placeholder="Ej: Ciencia Ficción"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl bg-bg-tertiary text-text-primary focus:outline-none ${formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-brand-red'}`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-secondary">Slug URL *</label>
              <input
                type="text"
                required
                placeholder="ej: ciencia-ficcion"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl bg-bg-tertiary text-text-primary focus:outline-none font-mono text-sm ${formErrors.slug ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-brand-red'}`}
              />
              {formErrors.slug && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {formErrors.slug}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-text-secondary">Descripción</label>
            <textarea
              rows={3}
              placeholder="Breve reseña descriptiva de este género..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-2.5 border rounded-xl bg-bg-tertiary text-text-primary focus:outline-none resize-none ${formErrors.description ? 'border-red-500' : 'border-gray-700 focus:border-brand-red'}`}
            />
            {formErrors.description && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {formErrors.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-bg-tertiary rounded-xl border border-gray-800">
            <div>
              <span className="text-sm font-semibold text-white block">Estado de Visibilidad</span>
              <span className="text-xs text-text-secondary">Activar o pausar la categoría en el sitio público</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red" />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white bg-bg-tertiary rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-brand-red hover:bg-brand-red-hover rounded-xl shadow-lg shadow-brand-red/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Procesando...' : editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Drawer Deslizable de Películas */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setViewingCategory(null)} />
          <div className="relative w-full max-w-lg bg-bg-secondary border-l border-gray-800 h-full overflow-y-auto p-6 space-y-6 z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{viewingCategory.name}</h3>
                <p className="text-xs text-text-secondary">Títulos asociados a este género</p>
              </div>
              <button onClick={() => setViewingCategory(null)} className="p-1 text-text-secondary hover:text-white rounded-lg hover:bg-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            {isLoadingMovies ? (
              <p className="text-text-secondary text-center py-12">Cargando catálogo...</p>
            ) : categoryMovies.length === 0 ? (
              <p className="text-text-secondary text-center py-12">No hay películas registradas en esta categoría.</p>
            ) : (
              <div className="space-y-3">
                {categoryMovies.map(movie => (
                  <div key={movie.id} className="flex items-center gap-4 p-3 rounded-xl bg-bg-tertiary border border-gray-800">
                    <img
                      src={movie.poster_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{movie.title}</h4>
                      <span className="text-xs text-text-secondary">{movie.release_year || 2024}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Confirmación Eliminación */}
      <ConfirmModal
        isOpen={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Categoría"
        message={`¿Estás seguro de que deseas eliminar la categoría "${deletingCategory?.name}"?`}
        isLoading={isDeleting}
      />

      {/* Modal Bloqueo de Eliminación de Integridad Referencial */}
      <Modal
        isOpen={Boolean(blockedDeleteMessage)}
        onClose={() => setBlockedDeleteMessage(null)}
        title="Acción Denegada por Integridad de Datos"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <p className="text-sm font-medium">{blockedDeleteMessage}</p>
          </div>
          <p className="text-xs text-text-secondary">
            Para eliminar esta categoría, primero reasigna o elimina las películas vinculadas desde la sección de Películas.
          </p>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setBlockedDeleteMessage(null)}
              className="px-4 py-2 text-sm font-medium text-white bg-bg-tertiary hover:bg-gray-800 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
