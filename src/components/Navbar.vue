<template>
  <nav class="bg-shopee-primary text-white sticky top-0 z-50 shadow-md">
    
    <div class="container mx-auto px-4 py-2 flex justify-between items-center text-xs">
      
      <div class="flex gap-4 items-center">
        <template v-if="auth.token && auth.user.role === 'SELLER'">
           <router-link to="/seller/add-product" class="hover:opacity-80 font-bold flex items-center gap-1 text-white">
              <PlusCircle :size="14" /> Tambah Produk
           </router-link>
           <span class="border-l border-white/30 h-3"></span>
        </template>

        <a href="#" class="hover:opacity-80">Seller Centre</a>
        <span class="border-l border-white/30 h-3"></span>
        <a href="#" class="hover:opacity-80">Download</a>
        <span class="border-l border-white/30 h-3"></span>
        <div class="flex gap-2">
           <span class="opacity-80">Ikuti kami di</span>
           <a href="#" class="font-bold">FB</a>
           <a href="#" class="font-bold">IG</a>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <template v-if="auth.token">
          <div class="flex items-center gap-1 cursor-pointer hover:opacity-80">
              <User :size="14" />
              <span class="font-medium truncate max-w-[150px]">{{ auth.user.name }}</span>
          </div>
          
          <span class="border-l border-white/30 h-3"></span>
          <router-link to="/orders" class="hover:opacity-80 font-medium">Pesanan Saya</router-link>
          
          <span class="border-l border-white/30 h-3"></span>
          <a @click.prevent="handleLogout" href="#" class="cursor-pointer hover:opacity-80 font-medium">Logout</a>
        </template>

        <template v-else>
          <router-link to="/login" class="font-bold hover:opacity-80">Login</router-link>
          <span class="border-l border-white/30 h-3"></span>
          <a href="#" class="font-bold hover:opacity-80">Daftar</a>
        </template>
      </div>
    </div>

    <div class="container mx-auto px-4 py-4 flex items-center gap-4 md:gap-8">
      
      <router-link to="/" class="text-2xl font-bold flex items-center gap-2 shrink-0 hover:opacity-95">
        <ShoppingBag :size="32" /> 
        <span class="hidden md:inline">ShopeeClone</span>
      </router-link>

      <div class="flex-1 relative">
        <form @submit.prevent class="w-full relative">
          <input 
            type="text" 
            placeholder="Diskon 50% untuk Pengguna Baru!" 
            class="w-full py-2.5 px-4 pr-16 rounded-sm text-black focus:outline-none shadow-sm text-sm"
          />
          <button class="absolute right-1 top-1 bottom-1 bg-shopee-primary px-5 rounded-sm flex justify-center items-center hover:bg-orange-600 transition">
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

      <router-link to="/cart" class="relative p-2 shrink-0 hover:opacity-90 transition">
        <ShoppingCart :size="26" />
        
        <span v-if="cartStore.totalItems > 0" 
              class="absolute -top-1 -right-1 bg-white text-shopee-primary text-xs font-bold px-1.5 py-0.5 rounded-full border border-shopee-primary shadow-sm">
           {{ cartStore.totalItems }}
        </span>
      </router-link>
    </div>

  </nav>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { ShoppingBag, Search, ShoppingCart, User, PlusCircle } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

// 1. Ambil data cart saat komponen dipasang (kalau user login)
onMounted(() => {
  if (auth.token) {
    cartStore.fetchCart();
  }
});

// 2. Watcher: Kalau user login/logout, refresh data cart
watch(() => auth.token, (newToken) => {
  if (newToken) {
    cartStore.fetchCart();
  } else {
    cartStore.clearCart();
  }
});

// 3. Fungsi Logout
const handleLogout = () => {
  const confirmLogout = confirm("Yakin ingin keluar?");
  if (confirmLogout) {
    auth.logout();
    cartStore.clearCart();
    router.push('/login');
  }
};
</script>