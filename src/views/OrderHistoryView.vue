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
import { ref, onMounted, onUnmounted } from 'vue'; // Tambah onUnmounted
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { supabase } from '../lib/supabase'; // [BARU] Import Supabase Client

const orders = ref<any[]>([]);
const loading = ref(true);
const auth = useAuthStore();
let realtimeChannel: any = null; // Variable untuk subscription

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAYMENT_ORCHESTRATOR_URL = import.meta.env.VITE_PAYMENT_ORCHESTRATOR_URL;

const api = axios.create({ baseURL: API_BASE_URL });

onMounted(async () => {
  if (!auth.token) return;
  await fetchOrders();
  setupRealtime(); // [BARU] Jalankan listener realtime
});

// [BARU] Bersihkan subscription saat pindah halaman
onUnmounted(() => {
  if (realtimeChannel) supabase.removeChannel(realtimeChannel);
});

const fetchOrders = async () => {
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
};

// [BARU] Fungsi Realtime
const setupRealtime = () => {
  if (!auth.user?.id) return;

  console.log("🔌 Connecting to Realtime for user:", auth.user.id);

  realtimeChannel = supabase
    .channel('public:orders')
    .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'orders',
        filter: `buyer_id=eq.${auth.user.id}` // Filter hanya order milik user ini
    }, (payload) => {
        console.log('⚡ Order updated:', payload);
        const updatedOrder = payload.new;
        
        // Cari order yang berubah di list lokal dan update statusnya
        const index = orders.value.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
            orders.value[index].status = updatedOrder.status;
            // Jika ada field lain yang berubah (misal payment_id), update juga
            if (updatedOrder.payment_id) orders.value[index].payment_id = updatedOrder.payment_id;
        }
    })
    .subscribe();
};

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
    case 'EXPIRED': return 'text-gray-400'; // Tambahan untuk expired
    default: return 'text-gray-500';
  }
};

const payNow = (order: any) => {
  const trxId = order.payment_id;
  if (trxId) {
      const orchestratorUrl = PAYMENT_ORCHESTRATOR_URL; 
      const simulationLink = `${orchestratorUrl}/api/payments/pay-simulate/${trxId}`; // [FIX] Tambah /api jika route backend anda pakai /api
      window.open(simulationLink, '_blank');
  } 
  else {
      alert("Menunggu inisiasi pembayaran atau ID pembayaran tidak ditemukan.");
  }
}
</script>