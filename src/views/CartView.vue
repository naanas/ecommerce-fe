<template>
  <Navbar />
  <div class="container mx-auto px-4 py-6">
    <div class="bg-white p-4 shadow-sm mb-4 flex items-center text-gray-500 text-sm">
      <div class="w-1/2">Produk</div>
      <div class="w-1/6 text-center">Harga Satuan</div>
      <div class="w-1/6 text-center">Kuantitas</div>
      <div class="w-1/6 text-center">Total Harga</div>
      <div class="w-1/6 text-center">Aksi</div>
    </div>

    <div v-for="item in cartItems" :key="item.id" class="bg-white p-4 shadow-sm mb-3 flex items-center border-b">
      <div class="w-1/2 flex items-center gap-4">
        <input type="checkbox" v-model="selectedItems" :value="item" class="w-4 h-4 accent-shopee-primary">
        <img :src="item.products.image_url || 'https://placehold.co/100'" class="w-20 h-20 object-cover border" />
        <span class="line-clamp-1 font-medium">{{ item.products.name }}</span>
      </div>
      <div class="w-1/6 text-center">Rp{{ formatPrice(item.products.price) }}</div>
      <div class="w-1/6 text-center">
        <div class="inline-flex border">
            <button class="px-2 border-r">-</button>
            <input type="text" :value="item.quantity" class="w-10 text-center text-sm outline-none" readonly>
            <button class="px-2 border-l">+</button>
        </div>
      </div>
      <div class="w-1/6 text-center text-shopee-primary font-bold">
        Rp{{ formatPrice(item.products.price * item.quantity) }}
      </div>
      <div class="w-1/6 text-center">
        <button @click="removeItem(item.id)" class="text-red-500 hover:underline">Hapus</button>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] py-4 px-8 flex justify-end items-center gap-6">
       <div class="text-lg">
          Total ({{ selectedItems.length }} produk): 
          <span class="text-shopee-primary text-2xl font-bold">Rp{{ formatPrice(totalPrice) }}</span>
       </div>
       <button @click="checkout" class="bg-shopee-primary text-white py-3 px-10 rounded shadow hover:bg-orange-600 font-bold">
          Checkout
       </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import { useAuthStore } from '../stores/auth';

const cartItems = ref<any[]>([]);
const selectedItems = ref<any[]>([]);
const auth = useAuthStore();
const router = useRouter();

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

onMounted(async () => {
  if(!auth.token) return router.push('/login');
  loadCart();
});

const loadCart = async () => {
    const res = await api.get('/cart', { headers: { Authorization: `Bearer ${auth.token}` }});
    cartItems.value = res.data.data;
}

const removeItem = async (id: string) => {
    await api.delete(`/cart/${id}`, { headers: { Authorization: `Bearer ${auth.token}` }});
    loadCart();
}

const totalPrice = computed(() => {
    return selectedItems.value.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
});

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

const checkout = () => {
    if(selectedItems.value.length === 0) return alert("Pilih produk dulu");
    // Simpan item terpilih ke state/localstorage untuk halaman checkout
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems.value));
    router.push('/checkout');
}
</script>