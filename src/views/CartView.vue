<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 pb-20">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6 flex items-center gap-2">
         <ShoppingCart :size="28"/> Keranjang Belanja
      </h1>

      <div v-if="loading" class="text-center py-10">
         <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-shopee-primary mx-auto"></div>
      </div>

      <div v-else-if="cartItems.length === 0" class="text-center py-20 bg-white rounded shadow-sm">
        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/cart/9bdd8040b334d31946f49e36beaf32db.png" class="h-24 mx-auto mb-4 opacity-50">
        <p class="text-gray-500 mb-4">Keranjangmu masih kosong.</p>
        <router-link to="/" class="bg-shopee-primary text-white px-6 py-2 rounded shadow hover:bg-orange-600 transition">Belanja Sekarang</router-link>
      </div>

      <div v-else>
        <div class="hidden md:flex bg-white p-4 shadow-sm mb-3 text-gray-500 text-sm font-medium rounded-sm">
          <div class="w-6"><input type="checkbox" @change="toggleAll" :checked="isAllSelected"></div>
          <div class="w-1/2">Produk</div>
          <div class="w-1/6 text-center">Harga Satuan</div>
          <div class="w-1/6 text-center">Kuantitas</div>
          <div class="w-1/6 text-center">Total Harga</div>
          <div class="w-16 text-center">Aksi</div>
        </div>

        <div v-for="item in cartItems" :key="item.id" class="bg-white p-4 shadow-sm mb-3 flex flex-col md:flex-row items-center border-b md:border-0 rounded-sm relative">
          
          <div class="w-full md:w-6 flex items-center mb-2 md:mb-0">
             <input type="checkbox" v-model="selectedItems" :value="item" class="w-4 h-4 accent-shopee-primary cursor-pointer">
          </div>

          <div class="w-full md:w-1/2 flex items-center gap-4">
            <img :src="item.products?.image_url || 'https://placehold.co/100'" class="w-20 h-20 object-cover border rounded-sm">
            <div>
                <h3 class="line-clamp-2 text-sm font-medium">{{ item.products?.name }}</h3>
                <p class="text-xs text-gray-500 mt-1">Sisa Stok: {{ item.products?.stock }}</p>
            </div>
          </div>

          <div class="w-full md:w-1/6 text-center py-2 md:py-0 text-sm">
             <span class="md:hidden text-gray-500 mr-2">Harga:</span>
             Rp{{ formatPrice(item.products?.price) }}
          </div>

          <div class="w-full md:w-1/6 flex justify-center py-2 md:py-0">
             <div class="flex items-center border rounded-sm">
                <button @click="changeQty(item, -1)" class="px-3 py-1 border-r hover:bg-gray-50">-</button>
                <input type="text" :value="item.quantity" class="w-10 text-center text-sm outline-none" readonly>
                <button @click="changeQty(item, 1)" class="px-3 py-1 border-l hover:bg-gray-50" :disabled="item.quantity >= item.products?.stock">+</button>
             </div>
          </div>

          <div class="w-full md:w-1/6 text-center py-2 md:py-0 font-bold text-shopee-primary">
             <span class="md:hidden text-gray-500 mr-2">Total:</span>
             Rp{{ formatPrice(item.products?.price * item.quantity) }}
          </div>

          <div class="w-full md:w-16 text-center">
             <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700 text-sm">Hapus</button>
          </div>

        </div>
      </div>

      <div v-if="cartItems.length > 0" class="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4 z-40">
         <div class="container mx-auto flex justify-between items-center">
            <div class="flex items-center gap-2">
               <input type="checkbox" @change="toggleAll" :checked="isAllSelected" class="accent-shopee-primary w-5 h-5">
               <span class="hidden md:inline text-sm">Pilih Semua ({{ cartItems.length }})</span>
            </div>
            <div class="flex items-center gap-4 md:gap-8">
               <div class="text-right">
                  <p class="text-sm text-gray-600">Total ({{ selectedItems.length }} produk):</p>
                  <p class="text-xl font-bold text-shopee-primary">Rp{{ formatPrice(grandTotal) }}</p>
               </div>
               <button 
                @click="checkout" 
                :disabled="selectedItems.length === 0"
                class="bg-shopee-primary text-white py-2 px-8 md:px-12 rounded shadow hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
               >
                  Checkout
               </button>
            </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { ShoppingCart } from 'lucide-vue-next';
import api from '../lib/axios'; // Ganti axios
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const cartItems = ref<any[]>([]);
const selectedItems = ref<any[]>([]);
const loading = ref(true);

const auth = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const loadCart = async () => {
  loading.value = true;
  try {
    const res = await api.get('/cart'); // Header otomatis
    cartItems.value = res.data.data;
  } catch (error) {
    console.error("Gagal load cart", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!auth.token) return router.push('/login');
  loadCart();
});

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p || 0);

const grandTotal = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + (item.products?.price * item.quantity), 0);
});

const isAllSelected = computed(() => {
   return cartItems.value.length > 0 && selectedItems.value.length === cartItems.value.length;
});

const toggleAll = (e: any) => {
   if (e.target.checked) {
      selectedItems.value = [...cartItems.value];
   } else {
      selectedItems.value = [];
   }
};

const changeQty = async (item: any, change: number) => {
   if (item.quantity + change < 1) return;
   if (item.quantity + change > item.products.stock) return alert("Stok tidak cukup!");

   item.quantity += change;

   try {
     await api.post('/cart', {
        product_id: item.products.id,
        quantity: change
     });
     
     cartStore.fetchCart();
   } catch(e) {
     item.quantity -= change;
     console.error(e);
   }
};

const deleteItem = async (id: string) => {
   if(!confirm("Hapus item ini?")) return;
   try {
     await api.delete(`/cart/${id}`);
     cartItems.value = cartItems.value.filter(i => i.id !== id);
     selectedItems.value = selectedItems.value.filter(i => i.id !== id);
     cartStore.fetchCart();
   } catch(e) { alert("Gagal hapus item"); }
};

const checkout = () => {
   localStorage.setItem('checkoutItems', JSON.stringify(selectedItems.value));
   router.push('/checkout');
};
</script>