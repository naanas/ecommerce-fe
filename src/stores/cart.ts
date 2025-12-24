import { defineStore } from 'pinia';
import api from '../lib/axios'; // Import dari konfigurasi pusat
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),
  getters: {
    totalItems: (state) => state.items.length,
  },
  actions: {
    async fetchCart() {
      const auth = useAuthStore();
      if (!auth.token) {
        this.items = [];
        return;
      }

      try {
        // URL sudah otomatis dibaca dari baseURL di src/lib/axios.ts
        // Header Authorization juga sudah otomatis dipasang
        const res = await api.get('/cart');
        if (res.data.success) {
          this.items = res.data.data;
        }
      } catch (error) {
        console.error("Gagal load cart", error);
      }
    },

    async addToCart(productId: string, quantity: number = 1) {
      const auth = useAuthStore();
      if (!auth.token) throw new Error("Silakan login terlebih dahulu");

      // Kirim ke Backend (Path relatif saja)
      await api.post('/cart', { product_id: productId, quantity });

      // Update State Lokal
      await this.fetchCart();
    },
    
    clearCart() {
      this.items = [];
    }
  }
});