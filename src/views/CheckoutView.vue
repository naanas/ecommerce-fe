<template>
  <Navbar />
  <div class="container mx-auto px-4 py-6 max-w-4xl">
    <div class="bg-white p-6 shadow-sm rounded mb-4">
      <h2 class="text-shopee-primary text-lg font-bold mb-4 flex items-center gap-2">
         📍 Alamat Pengiriman
      </h2>
      <div class="text-sm">
         <strong>{{ auth.user.name }} (+62) {{ auth.user.phone }}</strong> <br>
         Jalan Programming No. 1, Jakarta Selatan, DKI Jakarta
         <span class="border border-shopee-primary text-shopee-primary text-xs px-1 ml-2">Utama</span>
      </div>
    </div>

    <div class="bg-white p-6 shadow-sm rounded mb-4">
       <h3 class="font-bold mb-4">Produk Dipesan</h3>
       <div v-for="item in items" :key="item.id" class="flex justify-between items-center mb-4 border-b pb-2">
          <div class="flex items-center gap-4">
             <img :src="item.products.image_url" class="w-16 h-16 object-cover border">
             <span class="text-sm">{{ item.products.name }}</span>
          </div>
          <div class="text-sm">x{{ item.quantity }}</div>
          <div class="font-bold">Rp{{ formatPrice(item.products.price * item.quantity) }}</div>
       </div>
    </div>

    <div class="bg-white p-6 shadow-sm rounded mb-4">
       <h3 class="font-bold mb-4">Metode Pembayaran</h3>
       <div class="flex gap-4">
          <button 
            v-for="method in ['BCA_VA', 'BNI_VA','BRI_VA', 'OVO', 'DANA']" 
            :key="method"
            @click="selectedPayment = method"
            :class="selectedPayment === method ? 'border-shopee-primary text-shopee-primary bg-orange-50' : 'border-gray-200 hover:border-orange-300'"
            class="border px-4 py-2 rounded"
          >
            {{ method }}
          </button>
       </div>
    </div>

    <div class="bg-white p-6 shadow-sm rounded flex justify-end items-center gap-6">
        <div class="text-right">
            <div class="text-gray-500 text-sm">Total Pembayaran</div>
            <div class="text-shopee-primary text-2xl font-bold">Rp{{ formatPrice(total) }}</div>
        </div>
        <button @click="processPayment" class="bg-shopee-primary text-white py-3 px-12 rounded font-bold hover:bg-orange-600">
            Buat Pesanan
        </button>
    </div>
    
    <div v-if="paymentResult" class="fixed inset-0 bg-black/50 flex justify-center items-center">
       <div class="bg-white p-8 rounded-lg max-w-md w-full text-center">
          <h2 class="text-2xl font-bold mb-4">Pesanan Dibuat!</h2>
          <p class="mb-4">Silakan bayar menggunakan VA berikut:</p>
          <div class="bg-gray-100 p-4 font-mono text-xl font-bold mb-4">
             {{ paymentResult.payment_details.virtual_account || 'QR CODE' }}
          </div>
          <a :href="paymentResult.payment_details.payment_url" target="_blank" class="text-blue-500 underline mb-4 block">
             Simulasi Bayar (Klik Disini)
          </a>
          <button @click="router.push('/')" class="bg-shopee-primary text-white px-6 py-2 rounded">Selesai</button>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const items = ref<any[]>([]);
const selectedPayment = ref('VA_BCA');
const paymentResult = ref<any>(null);

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

onMounted(() => {
    const data = localStorage.getItem('checkoutItems');
    if(data) items.value = JSON.parse(data);
});

const total = computed(() => items.value.reduce((s, i) => s + (i.products.price * i.quantity), 0));
const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

const processPayment = async () => {
    try {
        // Format payload sesuai Backend OrderController.createOrder terbaru
        const payload = {
            payment_method_code: selectedPayment.value,
            items: items.value.map(i => ({
                product_id: i.product_id,
                quantity: i.quantity
            }))
        };

        const res = await api.post('/orders', payload, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });

        paymentResult.value = res.data.data;
        // Hapus temp cart
        localStorage.removeItem('checkoutItems');
    } catch (e: any) {
        alert(e.response?.data?.error || 'Gagal Checkout');
    }
}
</script>