<template>
  <div class="min-h-screen flex bg-white font-sans selection:bg-orange-100 selection:text-orange-600 overflow-hidden">
    
    <div class="hidden lg:flex lg:w-[45%] relative bg-shopee-primary">
      <img 
        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
        alt="Shopee Lifestyle" 
        class="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <div class="relative z-10 w-full flex flex-col justify-between p-12 text-white h-full">
        <div class="flex items-center gap-2 animate-fade-in">
          <ShoppingBag :size="32" class="text-white drop-shadow-md" />
          <span class="text-3xl font-bold tracking-tight drop-shadow-md">ShopeeClone</span>
        </div>
        
        <div class="animate-fade-in delay-200">
          <h1 class="text-5xl font-bold leading-tight mb-4 drop-shadow-lg">
            Belanja pintar,<br>tanpa batas.
          </h1>
          <p class="text-lg text-orange-50 font-medium max-w-md leading-relaxed drop-shadow-md">
            Gabung dengan komunitas belanja online terbesar dan nikmati promo gratis ongkir setiap hari.
          </p>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20 xl:px-24 relative w-full bg-orange-50/30 overflow-hidden">
      
      <div class="absolute inset-0 z-0 pointer-events-none">
         <div class="absolute -top-40 -right-32 w-[600px] h-[600px] bg-orange-300/30 rounded-full blur-3xl animate-blob"></div>
         <div class="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-shopee-primary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
         <div class="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-orange-100/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      <div class="w-full max-w-[440px] relative z-20 bg-white/90 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/50">
        
        <div class="lg:hidden mb-6 text-center animate-fade-in-up">
          <div class="inline-flex justify-center items-center p-3 rounded-full bg-orange-50 text-shopee-primary mb-3">
            <ShoppingBag :size="28" />
          </div>
        </div>

        <div class="text-center mb-8 animate-fade-in-up">
          <h2 class="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h2>
          <p class="text-sm text-gray-500 mt-2">
            Silakan masukkan detail akun ShopeeClone Anda
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5 animate-fade-in-up delay-100">
          
          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-gray-700 ml-1">Email / No. Handphone</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400 group-focus-within:text-shopee-primary transition-colors" />
              </div>
              <input 
                v-model="email"
                type="text" 
                class="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:border-shopee-primary focus:ring-1 focus:ring-shopee-primary focus:outline-none transition-all duration-200 sm:text-sm" 
                placeholder="Email atau No. HP"
                required
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock class="h-5 w-5 text-gray-400 group-focus-within:text-shopee-primary transition-colors" />
              </div>
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                class="block w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:border-shopee-primary focus:ring-1 focus:ring-shopee-primary focus:outline-none transition-all duration-200 sm:text-sm" 
                placeholder="Password"
                required
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <component :is="showPassword ? EyeOff : Eye" class="h-5 w-5" />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-bold text-white bg-[#ee4d2d] hover:bg-[#d73211] shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shopee-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98] mt-2"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              LOGGING IN...
            </span>
            <span v-else>LOG IN</span>
          </button>

          <div class="flex items-center justify-between text-xs sm:text-sm mt-4">
            <a href="#" class="text-blue-500 hover:underline">Lupa Password?</a>
            <a href="#" class="text-blue-500 hover:underline">Login dengan SMS</a>
          </div>
          
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-400 text-xs">ATAU</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
             <button type="button" class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm text-gray-600">
               <svg class="h-5 w-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.147 8.027-3.24 2.053-2.08 2.627-5.053 2.627-7.44 0-.48-.053-.96-.147-1.4h-10.5z"/></svg>
               Google
             </button>
             <button type="button" class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm text-gray-600">
               <svg class="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 3.16v1.437h3.754l-.52 3.667h-3.235v7.98H9.101.001z"></path></svg>
               Facebook
             </button>
          </div>

          <div class="text-center mt-6 text-sm">
            <span class="text-gray-400">Baru di Shopee?</span> 
            <a href="#" class="font-medium text-shopee-primary hover:text-orange-600 ml-1">Daftar</a>
          </div>

        </form>
      </div>

      <div class="absolute bottom-6 text-xs text-gray-400 z-20">
        &copy; 2024 ShopeeClone. Hak Cipta Dilindungi.
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingBag, User, Lock, Eye, EyeOff } from 'lucide-vue-next'; 
import api from '../lib/axios'; 
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const loading = ref(false);
const showPassword = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    // Simulate delay to see the loading state
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });

    if (res.data.success) {
      auth.login(res.data.data);
      router.push('/'); 
    }
  } catch (error: any) {
    console.error(error);
    alert(error.response?.data?.error || 'Login Gagal. Cek email/password.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Entrance Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }

/* === NEW: Background Blob Animation === */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 10s infinite ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>