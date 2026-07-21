import api from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  movies_count?: number;
  created_at?: string;
}

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  sortBy?: 'name' | 'movies_count' | 'is_active' | 'created_at';
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export const categoryService = {
  async list(params: CategoryQueryParams = {}): Promise<PaginatedResponse<Category>> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);

    const { data } = await api.get(`/categories?${query.toString()}`);
    return data;
  },

  async create(payload: Partial<Category>): Promise<Category> {
    const { data } = await api.post('/categories', payload);
    return data;
  },

  async update(id: string, payload: Partial<Category>): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, payload);
    return data;
  },

  async toggleStatus(id: string): Promise<Category> {
    const { data } = await api.patch(`/categories/${id}/toggle`);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async getMovies(slug: string): Promise<any[]> {
    const { data } = await api.get(`/categories/slug/${slug}/movies`);
    return data;
  }
};
