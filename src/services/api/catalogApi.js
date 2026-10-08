import { apiClient } from './client';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData';

export const catalogApi = {
  async getCategories() {
    try {
      const data = await apiClient.get('/categories/');
      return data?.results || data || MOCK_CATEGORIES;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', params.page);
      if (params.colors?.length) query.append('colors', params.colors.join(','));
      if (params.sizes?.length) query.append('sizes', params.sizes.join(','));
      if (params.min_price) query.append('min_price', params.min_price);
      if (params.max_price) query.append('max_price', params.max_price);
      if (params.in_stock_only) query.append('in_stock', 'true');

      const endpoint = `/products/${query.toString() ? `?${query.toString()}` : ''}`;
      const data = await apiClient.get(endpoint);
      return data;
    } catch {
      // Offline fallback filtering
      let filtered = [...MOCK_PRODUCTS];

      if (params.category) {
        filtered = filtered.filter(
          (p) => p.category.slug === params.category || p.category.id === Number(params.category)
        );
      }

      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.name.toLowerCase().includes(q)
        );
      }

      if (params.in_stock_only) {
        filtered = filtered.filter((p) => p.is_in_stock);
      }

      if (params.min_price) {
        filtered = filtered.filter((p) => p.price >= Number(params.min_price));
      }

      if (params.max_price) {
        filtered = filtered.filter((p) => p.price <= Number(params.max_price));
      }

      if (params.sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'newest') {
        filtered.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
      }

      return {
        count: filtered.length,
        total_pages: Math.ceil(filtered.length / 12) || 1,
        results: filtered,
      };
    }
  },

  async getProductById(id) {
    try {
      const data = await apiClient.get(`/products/${id}/`);
      return data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => String(p.id) === String(id));
      if (!found) throw new Error('Product not found');
      return found;
    }
  },

  async getProductBySlug(slug) {
    try {
      const data = await apiClient.get(`/products/slug/${slug}/`);
      return data;
    } catch {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
      if (!found) throw new Error('Product not found');
      return found;
    }
  },

  async getFacets() {
    try {
      return await apiClient.get('/catalog/facets/');
    } catch {
      return {
        colors: [
          { name: 'Crimson Vermilion', hex: '#8b0000', count: 4 },
          { name: 'Liquid Champagne Gold', hex: '#d4af37', count: 8 },
          { name: 'Imperial Emerald', hex: '#0f52ba', count: 5 },
          { name: 'Pristine Ivory', hex: '#fdfbf7', count: 6 },
          { name: 'Blush Petal', hex: '#f4c2c2', count: 7 },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'One Size (Free Size)', 'Custom Measurement'],
        price_range: { min: 40000, max: 250000 },
      };
    }
  },
};
