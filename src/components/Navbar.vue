<template>
  <nav class="bg-shopee-primary text-white sticky top-0 z-50 shadow-md font-sans">
    
    <div class="container mx-auto px-4 py-2 flex justify-between items-center text-xs">
      
      <div class="flex gap-4 items-center">
        <template v-if="auth.token && auth.user?.role === 'SELLER'">
           <router-link to="/seller/add-product" class="hover:opacity-80 font-bold flex items-center gap-1 text-white">
              <PlusCircle :size="14" /> Tambah Produk
           </router-link>
           <span class="border-l border-white/30 h-3"></span>
           <router-link to="/seller/my-shop" class="hover:opacity-80 font-bold flex items-center gap-1 text-white">
              <Store :size="14" /> Toko Saya
           </router-link>
           <span class="border-l border-white/30 h-3"></span>
        </template>

        <a href="#" class="hover:opacity-80">Seller Centre</a>
        <span class="border-l border-white/30 h-3"></span>
        <a href="#" class="hover:opacity-80">Download</a>
        
        <div class="flex gap-2 ml-2">
           <span class="opacity-80">Ikuti kami di</span>
           <a href="#" class="font-bold">FB</a>
           <a href="#" class="font-bold">IG</a>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="auth.token">
          <div class="flex items-center gap-1 cursor-pointer hover:opacity-80">
              <User :size="14" />
              <span class="font-medium truncate max-w-[150px]">{{ auth.user?.name }}</span>
          </div>
          <span class="border-l border-white/30 h-3"></span>
          <router-link to="/orders" class="hover:opacity-80 font-medium">Pesanan Saya</router-link>
          <span class="border-l border-white/30 h-3"></span>
          <button @click.prevent="handleLogout" class="cursor-pointer hover:opacity-80 font-medium bg-transparent border-none text-white text-xs">Logout</button>
        </template>

        <template v-else>
          <router-link to="/login" class="font-bold hover:opacity-80">Login</router-link>
          <span class="border-l border-white/30 h-3"></span>
          <router-link to="/register" class="font-bold hover:opacity-80">Daftar</router-link>
        </template>
      </div>
    </div>

    <div class="container mx-auto px-4 py-4 flex items-center gap-4 md:gap-8">
      
      <router-link to="/" class="text-2xl font-bold flex items-center gap-2 shrink-0 hover:opacity-95 text-white no-underline">
        <ShoppingBag :size="32" /> 
        <span class="hidden md:inline">ShopeeClone</span>
      </router-link>

      <div class="flex-1 relative z-0">
        <form @submit.prevent class="w-full relative">
          <input 
            type="text" 
            placeholder="Diskon 50% untuk Pengguna Baru!" 
            class="w-full py-2.5 px-4 pr-16 rounded-sm text-black focus:outline-none shadow-sm text-sm"
          />
          <button class="absolute right-1 top-1 bottom-1 bg-shopee-primary px-5 rounded-sm flex justify-center items-center hover:bg-orange-600 transition border border-white/10">
            <Search :size="16" class="text-white" />
          </button>
        </form>
        <div class="absolute -bottom-6 left-0 text-[10px] flex gap-3 text-white/80 w-full overflow-hidden whitespace-nowrap">
           <a href="#" class="hover:text-white">Kemeja Pria</a>
           <a href="#" class="hover:text-white">Tas Selempang</a>
           <a href="#" class="hover:text-white">Sepatu Running</a>
           <a href="#" class="hover:text-white">Voucher Game</a>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-4">
          
        <div class="relative" v-if="auth.token">
            <button @click="toggleNotif" class="relative p-2 shrink-0 hover:opacity-90 transition text-white">
                <Bell :size="26" />
                <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-white text-shopee-primary text-xs font-bold px-1.5 py-0.5 rounded-full border border-shopee-primary shadow-sm">
                    {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
            </button>

            <div v-if="showNotif" class="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-sm overflow-hidden z-50 text-gray-800 border border-gray-100 origin-top-right animate-fade-in-up">
                <div class="p-3 bg-gray-50 border-b flex justify-between items-center">
                    <h3 class="text-sm text-gray-500">Notifikasi Terbaru</h3>
                    <button @click="markAsRead" class="text-xs text-shopee-primary hover:underline">Tandai dibaca</button>
                </div>
                <div class="max-h-[300px] overflow-y-auto">
                    <div v-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                        <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712.png" class="w-20 mb-2 opacity-50"/>
                        Belum ada notifikasi
                    </div>
                    <div v-else v-for="notif in notifications" :key="notif.id" 
                         :class="{'bg-orange-50': !notif.is_read}" 
                         class="p-3 border-b hover:bg-gray-100 transition cursor-pointer flex gap-3 items-start">
                        <div class="w-10 h-10 shrink-0 bg-shopee-primary/10 rounded-full flex items-center justify-center text-shopee-primary">
                            <Bell :size="18" />
                        </div>
                        <div>
                            <p class="font-medium text-sm text-gray-800">{{ notif.title }}</p>
                            <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ notif.message }}</p>
                            <p class="text-[10px] text-gray-400 mt-1">{{ formatDate(notif.created_at) }}</p>
                        </div>
                    </div>
                </div>
                <div class="p-2 text-center border-t bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm text-gray-600">
                    Lihat Semua
                </div>
            </div>
        </div>

        <router-link to="/cart" class="relative p-2 shrink-0 hover:opacity-90 transition text-white">
          <ShoppingCart :size="26" />
          <span v-if="cartStore.totalItems > 0" 
                class="absolute -top-1 -right-1 bg-white text-shopee-primary text-xs font-bold px-1.5 py-0.5 rounded-full border border-shopee-primary shadow-sm">
             {{ cartStore.totalItems }}
          </span>
        </router-link>

      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ShoppingBag, Search, ShoppingCart, User, PlusCircle, Store, Bell } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { supabase } from '../lib/supabase';

const auth = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// State Notifikasi
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const showNotif = ref(false);
let notifChannel: any = null;

// Lifecycle & Watchers
onMounted(() => {
  if (auth.token) {
    cartStore.fetchCart();
    fetchNotifications();
    setupRealtime();
  }
});

watch(() => auth.token, (newToken) => {
  if (newToken) {
    cartStore.fetchCart();
    fetchNotifications();
    setupRealtime();
  } else {
    cartStore.clearCart();
    notifications.value = [];
    unreadCount.value = 0;
  }
});

// === LOGIC NOTIFIKASI ===
const toggleNotif = () => {
    showNotif.value = !showNotif.value;
    // Optional: Kalau mau auto-read pas dibuka, uncomment baris bawah
    // if (showNotif.value && unreadCount.value > 0) markAsRead();
};

const fetchNotifications = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        notifications.value = res.data.data;
        unreadCount.value = res.data.unread_count;
    } catch (err) { console.error("Err notif", err); }
};

const markAsRead = async () => {
    try {
        await axios.post(`${API_BASE_URL}/notifications/read`, {}, {
            headers: { Authorization: `Bearer ${auth.token}` }
        });
        unreadCount.value = 0;
        notifications.value.forEach(n => n.is_read = true);
    } catch (err) { console.error(err); }
};

const setupRealtime = () => {
    if (!auth.user?.id) return;
    if (notifChannel) supabase.removeChannel(notifChannel);

    notifChannel = supabase
        .channel('realtime:notifications')
        .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `user_id=eq.${auth.user.id}` 
            }, 
            (payload) => {
                console.log('🔔 Notif Realtime!', payload);
                notifications.value.unshift(payload.new);
                unreadCount.value++;
            }
        )
        .subscribe();
};

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});
};

const handleLogout = () => {
  if(confirm("Yakin ingin keluar?")) {
      auth.logout();
      cartStore.clearCart();
      if(notifChannel) supabase.removeChannel(notifChannel);
      router.push('/login');
  }
};

onUnmounted(() => {
    if(notifChannel) supabase.removeChannel(notifChannel);
});
</script>

<style scoped>
/* Pastikan warna ini ada di tailwind.config.js, atau gunakan kode ini sebagai fallback */
.bg-shopee-primary { background-color: #ee4d2d; }
.text-shopee-primary { color: #ee4d2d; }
.border-shopee-primary { border-color: #ee4d2d; }

/* Animasi Dropdown */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.2s ease-out;
}
</style>