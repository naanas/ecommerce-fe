<template>
  <Navbar />
  
  <div class="container mx-auto px-4 py-6">
    <div class="w-full h-48 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-sm relative overflow-hidden">
      <div class="absolute inset-0 bg-black/10"></div>
      <span class="relative z-10">FLASH SALE 12.12</span>
    </div>

    <div class="bg-white p-4 rounded mb-4 shadow-sm uppercase font-bold text-gray-700 border-b-2 border-shopee-primary flex justify-between items-center">
      <span>Rekomendasi</span>
      <span class="text-xs font-normal text-gray-500 lowercase">Stok update real-time</span>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-500 flex flex-col items-center">
       <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-shopee-primary mb-2"></div>
       Memuat produk...
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
      <div v-for="product in products" :key="product.id" class="bg-white hover:shadow-xl transition duration-200 rounded-sm border border-transparent hover:border-shopee-primary cursor-pointer group flex flex-col h-full relative">
        
        <div class="aspect-square bg-gray-100 w-full relative overflow-hidden">
          <img :src="product.image_url || 'https://placehold.co/200'" 
               :class="{ 'grayscale opacity-70': product.stock <= 0 }"
               class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          
          <div v-if="product.stock > 0" class="absolute top-0 right-0 bg-yellow-400 text-xs px-1 py-0.5 font-bold text-red-600 z-10">
            50%
          </div>

          <div v-if="product.stock <= 0" class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
            <div class="rounded-full bg-black/60 p-3 mb-1">
               <span class="text-white font-bold text-xs tracking-widest border-2 border-white px-2 py-1 rounded-sm">HABIS</span>
            </div>
            <span class="text-white text-[10px]">Restock Soon</span>
          </div>
        </div>

        <div class="p-2 flex flex-col flex-1 justify-between">
          <div>
             <div class="text-sm line-clamp-2 mb-2 min-h-[40px] text-gray-800">{{ product.name }}</div>
             <div class="flex items-center gap-1 mb-2">
                <span class="text-[10px] text-gray-500 border border-gray-300 px-1 rounded-sm">Cod</span>
                <span v-if="product.stock > 0 && product.stock < 5" class="text-[10px] text-red-500 font-bold animate-pulse">
                   Sisa {{ product.stock }}!
                </span>
             </div>
          </div>
          
          <div>
            <div class="flex items-center justify-between mt-1">
              <span class="text-shopee-primary text-base font-medium">Rp{{ formatPrice(product.price) }}</span>
              <span class="text-[10px] text-gray-500">{{ product.stock > 0 ? `Stok: ${product.stock}` : 'Sold Out' }}</span>
            </div>
            
            <button 
              @click="addToCart(product)" 
              :disabled="product.stock <= 0 || (auth.user && auth.user.id === product.seller_id)"
              :class="[
                (product.stock <= 0 || (auth.user && auth.user.id === product.seller_id))
                  ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'border-shopee-primary text-shopee-primary bg-red-50 hover:bg-shopee-primary hover:text-white'
              ]"
              class="mt-3 w-full border text-xs py-1.5 transition flex justify-center items-center gap-1 rounded-sm"
            >
              <ShoppingCart :size="14" /> 
              
              <span v-if="product.stock <= 0">Stok Habis</span>
              <span v-else-if="auth.user && auth.user.id === product.seller_id">Toko Anda</span>
              <span v-else>+Keranjang</span>

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
import { ShoppingCart } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const products = ref<any[]>([]);
const loading = ref(true);

const auth = useAuthStore();
const cartStore = useCartStore();

const api = axios.create({ baseURL: 'https://ecommerce-api-topaz-iota.vercel.app/api' });

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await api.get('/products');
    products.value = res.data.data;
  } catch (error) {
    console.error("Gagal ambil produk", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

// Logika Tambah Keranjang dengan Validasi Lengkap
const addToCart = async (product: any) => {
  // 1. Cek Login
  if(!auth.token) {
    alert("Silakan login terlebih dahulu!");
    return;
  }
  
  // 2. Validasi Anti-Self-Buy (Mencegah beli barang sendiri)
  if (auth.user.id === product.seller_id) {
    alert("Waduh! Anda tidak bisa membeli produk dagangan sendiri.");
    return;
  }

  // 3. Validasi Stok Frontend
  if(product.stock <= 0) {
    alert("Maaf, stok produk ini habis!");
    return;
  }
  
  try {
    await cartStore.addToCart(product.id, 1);
    alert('Berhasil masuk keranjang!');
  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.error || 'Gagal tambah keranjang');
  }
}
</script>