<template>
  <Navbar />
  
  <div class="container mx-auto px-4 py-6">
    <div class="w-full h-48 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-sm relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <span class="relative z-10">DISKON 50% HARI INI</span>
    </div>

    <div class="bg-white p-4 rounded mb-4 shadow-sm uppercase font-bold text-gray-700 border-b-2 border-shopee-primary">
      Rekomendasi
    </div>

    <div v-if="loading" class="text-center py-10 text-gray-500">
       Sedang memuat produk...
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <div v-for="product in products" :key="product.id" class="bg-white hover:shadow-xl transition duration-200 rounded-sm border border-transparent hover:border-shopee-primary cursor-pointer group flex flex-col h-full">
        
        <div class="aspect-square bg-gray-100 w-full relative overflow-hidden">
          <img :src="product.image_url || 'https://placehold.co/200'" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          <div class="absolute top-0 right-0 bg-yellow-400 text-xs px-1 py-0.5 font-bold text-red-600">
            50%
          </div>
        </div>

        <div class="p-2 flex flex-col flex-1 justify-between">
          <div>
             <div class="text-sm line-clamp-2 mb-2 min-h-[40px]">{{ product.name }}</div>
             <div class="flex items-center gap-1 mb-1">
                <span class="text-xs text-gray-400 border border-shopee-primary text-shopee-primary px-0.5 rounded-[2px]">Grosir</span>
                <span class="text-xs text-gray-400 border border-green-500 text-green-500 px-0.5 rounded-[2px]">Bebas Ongkir</span>
             </div>
          </div>
          
          <div>
            <div class="flex items-center justify-between mt-2">
              <span class="text-shopee-primary text-base font-medium">Rp{{ formatPrice(product.price) }}</span>
              <span class="text-[10px] text-gray-500">10RB Terjual</span>
            </div>
            
            <button @click="addToCart(product)" class="mt-3 w-full border border-shopee-primary text-shopee-primary text-xs py-1.5 bg-red-50 hover:bg-shopee-primary hover:text-white transition flex justify-center items-center gap-1 rounded-sm">
              <ShoppingCart :size="14" /> +Keranjang
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { ShoppingCart } from 'lucide-vue-next'; // Icon Keranjang
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const products = ref<any[]>([]);
const loading = ref(true);

const auth = useAuthStore();
const cartStore = useCartStore(); // Pakai store keranjang

// Setup Axios
const api = axios.create({ baseURL: 'http://localhost:4000/api' });

onMounted(async () => {
  try {
    const res = await api.get('/products');
    products.value = res.data.data;
  } catch (error) {
    console.error("Gagal ambil produk", error);
  } finally {
    loading.value = false;
  }
});

// Helper Format Rupiah
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

// Fungsi Tambah ke Keranjang
const addToCart = async (product: any) => {
  // Cek login dulu
  if(!auth.token) {
    alert("Silakan login terlebih dahulu!");
    return;
  }
  
  try {
    // Panggil action Pinia (otomatis update angka di Navbar)
    await cartStore.addToCart(product.id, 1);
    alert('Berhasil masuk keranjang!');
  } catch (e) {
    console.error(e);
    alert('Gagal tambah keranjang');
  }
}
</script>