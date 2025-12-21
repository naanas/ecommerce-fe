<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <router-link to="/" class="text-shopee-primary text-2xl font-bold flex items-center gap-2">
            <ShoppingBag :size="32" /> ShopeeClone
          </router-link>
          <span class="text-xl text-gray-700 hidden md:block">Login</span>
        </div>
        <a href="#" class="text-shopee-primary text-sm font-bold">Butuh Bantuan?</a>
      </div>
    </nav>

    <div class="bg-shopee-primary py-10 md:py-20 bg-[url('https://cf.shopee.co.id/file/sg-11134004-7rbk7-ll1w8x8j873f43')] bg-center bg-cover bg-no-repeat bg-blend-multiply">
      <div class="container mx-auto px-4 flex justify-center md:justify-end">
        
        <div class="bg-white rounded-lg shadow-lg w-full max-w-[400px] p-8 min-h-[400px] flex flex-col justify-center">
          <h2 class="text-xl font-medium mb-6">Log In</h2>

          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <input 
                v-model="email"
                type="email" 
                placeholder="Email" 
                class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>
            <div class="mb-6">
              <input 
                v-model="password"
                type="password" 
                placeholder="Password" 
                class="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <button 
              type="submit" 
              class="w-full bg-shopee-primary text-white py-3 rounded text-sm font-medium hover:bg-orange-600 transition disabled:opacity-50"
              :disabled="loading"
            >
              {{ loading ? 'LOGGING IN...' : 'LOG IN' }}
            </button>
          </form>

          <div class="mt-4 flex justify-between text-xs text-blue-500">
            <a href="#">Lupa Password</a>
            <a href="#">Login dengan SMS</a>
          </div>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-400 text-xs">ATAU</span>
            </div>
          </div>

          <div class="text-center text-sm text-gray-400">
            Baru di Shopee? <a href="#" class="text-shopee-primary font-medium">Daftar</a>
          </div>
        </div>

      </div>
    </div>
    
    <div class="container mx-auto py-8 text-center text-gray-500 text-xs">
        &copy; 2024 ShopeeClone. Hak Cipta Dilindungi.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingBag } from 'lucide-vue-next';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    // Sesuaikan URL dengan backend kamu
    const res = await axios.post('https://ecommerce-api-topaz-iota.vercel.app/api/auth/login', {
      email: email.value,
      password: password.value
    });

    if (res.data.success) {
      // Simpan token ke Pinia Store
      auth.login(res.data.data);
      alert("Login Berhasil!");
      router.push('/'); // Redirect ke Home
    }
  } catch (error: any) {
    console.error(error);
    alert(error.response?.data?.error || 'Login Gagal. Cek email/password.');
  } finally {
    loading.value = false;
  }
};
</script>