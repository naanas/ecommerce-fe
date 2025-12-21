import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[], // Menyimpan data item keranjang
  }),
  getters: {
    // Menghitung jumlah item unik (jumlah jenis barang)
    totalItems: (state) => state.items.length,
    
    // OPSI: Kalau mau menghitung total quantity (misal beli 2 baju + 3 celana = 5)
    // totalQuantity: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
  },
  actions: {
    async fetchCart() {
      const auth = useAuthStore();
      // Kalau gak ada token/gak login, kosongin keranjang
      if (!auth.token) {
        this.items = [];
        return;
      }

      try {
        const res = await axios.get('http://localhost:4000/api/cart', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
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

      // 1. Kirim ke Backend
      await axios.post('http://localhost:4000/api/cart', 
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      // 2. Update State Lokal (Fetch ulang biar sinkron)
      await this.fetchCart();
    },
    
    // Reset saat logout
    clearCart() {
      this.items = [];
    }
  }
});