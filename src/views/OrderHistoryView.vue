<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 pb-10">
    <div class="container mx-auto px-4 py-6 max-w-4xl">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">Pesanan Saya</h1>

      <div v-if="loading" class="text-center py-10">
        <span class="text-gray-500">Memuat riwayat pesanan...</span>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded shadow">
        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/orderlist/5fafbb923393b712b96488590b8f781d.png" class="mx-auto w-32 mb-4 opacity-50">
        <p class="text-gray-500 mb-4">Belum ada pesanan.</p>
        <router-link to="/" class="bg-shopee-primary text-white px-6 py-2 rounded">Belanja Sekarang</router-link>
      </div>

      <div v-else class="flex flex-col gap-4">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded shadow-sm overflow-hidden">
          
          <div class="border-b px-6 py-4 flex justify-between items-center bg-gray-50">
            <div class="text-sm text-gray-500">
              No. Pesanan: <span class="font-bold text-gray-700">{{ order.id.substring(0, 8).toUpperCase() }}</span>
              <span class="mx-2">|</span>
              {{ formatDate(order.created_at) }}
            </div>
            <div>
              <span :class="statusClass(order.status)" class="text-sm font-bold uppercase tracking-wide">
                {{ order.status }}
              </span>
            </div>
          </div>

          <div v-for="item in order.order_items" :key="item.id" class="px-6 py-4 border-b flex gap-4 items-center hover:bg-gray-50 transition">
            <img :src="item.products?.image_url || 'https://placehold.co/100'" class="w-20 h-20 object-cover border rounded-sm">
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 line-clamp-1">{{ item.products?.name }}</h3>
              <p class="text-sm text-gray-500">x{{ item.quantity }}</p>
            </div>
            <div class="text-right">
              <p class="text-gray-400 text-xs line-through" v-if="false">Rp{{ formatPrice(item.products.price * 1.2) }}</p>
              <p class="text-shopee-primary font-medium">Rp{{ formatPrice(item.price_at_purchase) }}</p>
            </div>
          </div>

          <div class="px-6 py-4 bg-orange-50/30 flex justify-between items-center">
             <div class="text-xs text-gray-500">
                Payment ID: {{ order.payment_id || '-' }}
             </div>
             <div class="flex items-center gap-4">
                <div class="text-right">
                  <span class="text-sm text-gray-600 mr-2">Total Pesanan:</span>
                  <span class="text-xl font-bold text-shopee-primary">Rp{{ formatPrice(order.total_amount) }}</span>
                </div>
                
                <button v-if="order.status === 'PENDING'" @click="payNow(order)" class="bg-shopee-primary text-white px-6 py-2 rounded text-sm hover:bg-orange-600 shadow-sm">
                  Bayar Sekarang
                </button>
                <button v-if="order.status === 'SUCCESS'" class="bg-shopee-primary text-white px-6 py-2 rounded text-sm hover:bg-orange-600 shadow-sm">
                  Beli Lagi
                </button>
             </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const orders = ref<any[]>([]);
const loading = ref(true);
const auth = useAuthStore();
const api = axios.create({ baseURL: 'http://localhost:4000/api' });

onMounted(async () => {
  if (!auth.token) return;
  try {
    const res = await api.get('/orders/my', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    orders.value = res.data.data;
  } catch (error) {
    console.error("Gagal ambil history", error);
  } finally {
    loading.value = false;
  }
});

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const statusClass = (status: string) => {
  switch (status) {
    case 'PENDING': return 'text-orange-500';
    case 'SUCCESS': return 'text-green-600';
    case 'FAILED': return 'text-red-600';
    default: return 'text-gray-500';
  }
};

const payNow = (order: any) => {
const trxId = order.payment_id;
  if (trxId) {
     // URL Orchestrator (Backend Payment)
     const orchestratorUrl = 'http://localhost:3000'; 
     
     // Buka link simulasi pembayaran di tab baru
     const simulationLink = `${orchestratorUrl}/api/payments/pay-simulate/${trxId}`;
     window.open(simulationLink, '_blank');
  } 
  else {
     // Fallback kalau payment_id null (berarti backend gagal update ID saat checkout)
     alert("Menunggu inisiasi pembayaran atau ID pembayaran tidak ditemukan.");
  }
}
</script>