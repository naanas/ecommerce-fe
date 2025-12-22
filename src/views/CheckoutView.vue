<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 pb-20">
    <div class="container mx-auto px-4 py-6 max-w-4xl">
      <h1 class="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <CreditCard :size="24" /> Checkout
      </h1>

      <div class="grid md:grid-cols-3 gap-6">
        
        <div class="md:col-span-2 space-y-4">
          <div class="bg-white p-6 rounded shadow-sm relative overflow-hidden">
             <div class="absolute top-0 left-0 w-1 h-full bg-repeating-linear-gradient(45deg, #ee4d2d, #ee4d2d 10px, #fff 10px, #fff 20px, #00bfa5 20px, #00bfa5 30px, #fff 30px, #fff 40px)"></div>
             <h3 class="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin :size="18" class="text-shopee-primary"/> Alamat Pengiriman
             </h3>
             <div class="text-sm text-gray-600 ml-6">
                <p class="font-bold text-gray-800">{{ auth.user?.name }} (+62) 812-3456-7890</p>
                <p>Jalan Teknologi No. 10, Jakarta Selatan</p>
             </div>
          </div>

          <div class="bg-white p-6 rounded shadow-sm">
             <h3 class="font-bold text-gray-700 mb-4 border-b pb-2">Produk Dipesan</h3>
             <div v-for="item in checkoutItems" :key="item.id" class="flex gap-4 mb-4 last:mb-0">
                <img :src="item.products?.image_url || 'https://placehold.co/100'" class="w-16 h-16 object-cover border rounded bg-gray-50">
                <div class="flex-1">
                   <h4 class="font-medium text-gray-800 line-clamp-1">{{ item.products?.name }}</h4>
                   <p class="text-xs text-gray-400 mt-1">x{{ item.quantity }}</p>
                </div>
                <div class="text-right">
                   <p class="font-medium text-gray-800">Rp{{ formatPrice(item.products?.price) }}</p>
                </div>
             </div>
          </div>
        </div>

        <div class="md:col-span-1 space-y-4">
          <div class="bg-white p-6 rounded shadow-sm">
            <h3 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
               <Wallet :size="18" /> Metode Pembayaran
            </h3>
            
            <div class="space-y-3">
              <p class="text-xs text-gray-400 font-bold uppercase mt-2">Transfer Bank</p>
              
              <label class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-shopee-primary transition" :class="{'bg-orange-50 border-shopee-primary': selectedPaymentMethod === 'BCA_VA'}">
                <input type="radio" v-model="selectedPaymentMethod" value="BCA_VA" class="accent-shopee-primary">
                <div class="flex flex-col">
                  <span class="text-sm font-medium">BCA Virtual Account</span>
                </div>
              </label>

              <label class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-shopee-primary transition" :class="{'bg-orange-50 border-shopee-primary': selectedPaymentMethod === 'BNI_VA'}">
                <input type="radio" v-model="selectedPaymentMethod" value="BNI_VA" class="accent-shopee-primary">
                <div class="flex flex-col">
                   <span class="text-sm font-medium">BNI Virtual Account</span>
                </div>
              </label>

              <label class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-shopee-primary transition" :class="{'bg-orange-50 border-shopee-primary': selectedPaymentMethod === 'BRI_VA'}">
                <input type="radio" v-model="selectedPaymentMethod" value="BRI_VA" class="accent-shopee-primary">
                <div class="flex flex-col">
                   <span class="text-sm font-medium">BRI Virtual Account</span>
                </div>
              </label>

              <p class="text-xs text-gray-400 font-bold uppercase mt-4">E-Wallet & QRIS</p>
              
              <label class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-shopee-primary transition" :class="{'bg-orange-50 border-shopee-primary': selectedPaymentMethod === 'OVO'}">
                <input type="radio" v-model="selectedPaymentMethod" value="OVO" class="accent-shopee-primary">
                <span class="text-sm font-medium">OVO</span>
              </label>

              <label class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-shopee-primary transition" :class="{'bg-orange-50 border-shopee-primary': selectedPaymentMethod === 'DANA'}">
                <input type="radio" v-model="selectedPaymentMethod" value="DANA" class="accent-shopee-primary">
                <span class="text-sm font-medium">DANA</span>
              </label>

              <label class="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-shopee-primary transition" :class="{'bg-orange-50 border-shopee-primary': selectedPaymentMethod === 'QRIS'}">
                <input type="radio" v-model="selectedPaymentMethod" value="QRIS" class="accent-shopee-primary">
                <span class="text-sm font-medium">QRIS (Scan All)</span>
              </label>

            </div>
          </div>

          <div class="bg-white p-6 rounded shadow-sm sticky top-24">
             <div class="flex justify-between pt-4 border-t font-bold text-lg text-shopee-primary mb-4">
                <span>Total</span>
                <span>Rp{{ formatPrice(totalPrice) }}</span>
             </div>

             <button @click="processCheckout" :disabled="loading" class="w-full bg-shopee-primary text-white py-3 rounded font-bold hover:bg-orange-600 transition disabled:opacity-50">
                {{ loading ? 'Memproses...' : 'BUAT PESANAN' }}
             </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue';
import { MapPin, CreditCard, Wallet } from 'lucide-vue-next';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const checkoutItems = ref<any[]>([]);
const loading = ref(false);
const selectedPaymentMethod = ref('BCA_VA'); // Default selected

// Gunakan URL Production kamu jika sudah deploy
const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_BASE_URL 
});
onMounted(() => {
  if (!auth.token) return router.push('/login');
  const items = localStorage.getItem('checkoutItems');
  if (items) checkoutItems.value = JSON.parse(items);
  else router.push('/cart');
});

const totalPrice = computed(() => {
  return checkoutItems.value.reduce((sum, item) => sum + (item.products.price * item.quantity), 0);
});

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

const processCheckout = async () => {
  loading.value = true;
  try {
    const res = await api.post('/orders', {
      items: checkoutItems.value.map(item => ({
        product_id: item.products.id,
        quantity: item.quantity
      })),
      payment_method_code: selectedPaymentMethod.value
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    const result = res.data.data;
    const payment = result.payment_details; 

    // Bersihkan cart lokal
    localStorage.removeItem('checkoutItems');

    // [FIXED] Logika Redirect Pembayaran
    if (payment) {
        // Cek apakah ada Payment URL (untuk E-Wallet / Payment Gateway / Link Ajaib)
        if (payment.payment_url && payment.payment_url.startsWith('http')) {
             // Redirect window browser ke halaman pembayaran eksternal
             window.location.href = payment.payment_url;
        } else {
             // Jika tipe VA atau Manual, tampilkan halaman sukses internal
             const paymentDataString = btoa(JSON.stringify(payment));
             router.push(`/payment-success?data=${paymentDataString}`);
        }
    } else {
        // Fallback jika payment detail kosong
        alert("Order berhasil dibuat! Silakan cek status di menu Pesanan Saya.");
        router.push('/orders');
    }

  } catch (error: any) {
    console.error("Checkout Failed:", error);
    alert(error.response?.data?.error || "Gagal checkout");
  } finally {
    loading.value = false;
  }
};
</script>