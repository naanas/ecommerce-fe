<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-10">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      
      <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Order Berhasil!</h2>
      <p class="text-gray-500 mb-6">Segera selesaikan pembayaran Anda.</p>

      <div v-if="paymentDetails && Object.keys(paymentDetails).length > 0" class="bg-gray-50 p-4 rounded border mb-6 text-left">
        
        <div v-if="paymentDetails?.virtual_account">
          <p class="text-xs text-gray-500">Nomor Virtual Account</p>
          <div class="flex items-center gap-2">
             <p class="text-xl font-mono font-bold text-shopee-primary mt-1">{{ paymentDetails.virtual_account }}</p>
          </div>
        </div>

        <div v-if="paymentDetails?.qr_code" class="mt-3 text-center">
            <p class="text-xs text-gray-500 mb-2">Scan QRIS</p>
            <img :src="paymentDetails.qr_code" class="mx-auto w-32 h-32 border" />
        </div>
      </div>

      <div v-else class="text-sm text-yellow-600 bg-yellow-50 p-3 rounded mb-4">
         Menunggu inisiasi pembayaran. Silakan cek ulang nanti.
      </div>

      <div class="flex flex-col gap-3">
        <button v-if="paymentDetails?.transaction_id" @click="goToPayment" class="w-full bg-shopee-primary text-white py-3 rounded font-bold hover:bg-orange-600 transition shadow-md">
            Bayar Sekarang 
        </button>

        <router-link to="/orders" class="w-full text-gray-500 text-sm hover:underline py-2">
            Cek Status Pesanan Saya
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';

const route = useRoute();
const paymentDetails = ref<any>({});

onMounted(() => {
  const data = route.query.data as string;
  if(data) {
    try {
      // Decode Base64 safely
      const parsed = JSON.parse(atob(data));
      paymentDetails.value = parsed || {}; 
    } catch(e) {
      console.error("Gagal parse data payment", e);
      paymentDetails.value = {}; // Fallback ke object kosong biar gak error
    }
  }
});

const goToPayment = () => {
    // Priority 1: Direct URL
    if (paymentDetails.value?.payment_url) {
        window.open(paymentDetails.value.payment_url, '_blank');
        return;
    }

    // Priority 2: Simulation Link
    if (paymentDetails.value?.transaction_id) {
        const orchestratorUrl = 'https://payment-orchestrator-fkb1.vercel.app/'; 
        const link = `${orchestratorUrl}/api/payments/pay-simulate/${paymentDetails.value.transaction_id}`;
        window.open(link, '_blank');
    } else {
        alert("Link pembayaran belum tersedia.");
    }
}
</script>