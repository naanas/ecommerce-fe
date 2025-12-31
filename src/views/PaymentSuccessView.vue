<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
      
      <div class="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-800 mb-1">Order Berhasil Dibuat!</h2>
      <p class="text-gray-500 mb-6 text-sm">Selesaikan pembayaran sebelum waktu habis.</p>

      <div v-if="hasPaymentData" class="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6 text-left shadow-inner">
        
        <div class="flex justify-between items-start mb-4 border-b border-gray-200 pb-3">
          <div>
            <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Metode Pembayaran</p>
            <p class="font-bold text-gray-800 text-sm">{{ paymentDetails.payment_method || 'Online Payment' }}</p>
          </div>
          <div class="text-right">
             <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Tagihan</p>
             <p class="font-bold text-orange-600 text-sm">
                IDR {{ Number(paymentDetails.amount || 0).toLocaleString('id-ID') }}
             </p>
          </div>
        </div>

        <div v-if="paymentDetails.virtual_account" class="mb-4">
          <p class="text-xs text-gray-500 mb-1">Nomor Virtual Account</p>
          <div class="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
             <p class="text-xl font-mono font-bold text-gray-800 tracking-widest">
               {{ paymentDetails.virtual_account }}
             </p>
             <button @click="copyToClipboard(paymentDetails.virtual_account)" class="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase">
               Salin
             </button>
          </div>
          <p class="text-[10px] text-gray-400 mt-1">*Lakukan transfer ke bank terkait</p>
        </div>

        <div v-if="paymentDetails.qr_data" class="mt-4 text-center bg-white p-4 rounded-xl border border-gray-200">
            <p class="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">Scan QR Code</p>
            <div class="flex justify-center">
              <QrcodeVue 
                :value="paymentDetails.qr_data" 
                :size="180" 
                level="H" 
                render-as="svg"
              />
            </div>
            <p class="text-[10px] text-gray-400 mt-3">Scan menggunakan ShopeePay, GoPay, OVO, dll.</p>
        </div>

        <div v-else-if="paymentDetails.qr_code" class="mt-4 text-center">
            <p class="text-xs text-gray-500 mb-2">Scan QRIS</p>
            <img :src="paymentDetails.qr_code" class="mx-auto w-40 h-40 border rounded shadow-sm" />
        </div>

      </div>
      
      <div v-else class="py-10 text-gray-400 italic">
        Memuat data pembayaran...
      </div>

      <div class="flex flex-col gap-3">
        <button 
          v-if="paymentDetails.payment_url || paymentDetails.deeplink" 
          @click="goToPayment" 
          class="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2">
            Lanjut ke Aplikasi Pembayaran
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
        </button>
        
        <button 
          v-else-if="paymentDetails.transaction_id" 
          @click="openSimulation" 
          class="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition">
            Simulasi Pembayaran (Dev Mode)
        </button>

        <router-link to="/orders" class="w-full text-gray-500 text-sm hover:text-gray-800 py-2 transition-colors">
            Cek Status Pesanan Saya
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import QrcodeVue from 'qrcode.vue'; // [WAJIB] npm install qrcode.vue

const route = useRoute();
const paymentDetails = ref<any>({});

const orchestratorUrl = import.meta.env.VITE_PAYMENT_ORCHESTRATOR_URL;

// Helper untuk cek apakah object kosong
const hasPaymentData = computed(() => paymentDetails.value && Object.keys(paymentDetails.value).length > 0);

onMounted(() => {
  const data = route.query.data as string;
  if(data) {
    try {
      // Decode Base64 dari URL query params
      // Format URL biasanya: /payment-success?data=ey...
      paymentDetails.value = JSON.parse(atob(data)) || {}; 
      console.log("Payment Data Loaded:", paymentDetails.value);
    } catch(e) {
      console.error("Gagal parsing data pembayaran", e);
      paymentDetails.value = {};
    }
  }
});

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Nomor VA berhasil disalin!");
}

const goToPayment = () => {
    // Prioritaskan Deep Link (buka aplikasi)
    if (paymentDetails.value?.deeplink) {
        window.open(paymentDetails.value.deeplink, '_self'); // '_self' untuk deep link mobile
        return;
    }
    // Jika tidak ada deep link, buka Payment URL (Web Checkout)
    if (paymentDetails.value?.payment_url) {
        window.open(paymentDetails.value.payment_url, '_blank');
        return;
    }
}

const openSimulation = () => {
    // Fallback ke simulasi orchestrator jika tidak ada link partner
    if (paymentDetails.value?.transaction_id) {
        const link = `${orchestratorUrl}/payments/pay-simulate/${paymentDetails.value.transaction_id}`;
        window.open(link, '_blank');
    } else {
        alert("Link pembayaran belum tersedia.");
    }
}
</script>