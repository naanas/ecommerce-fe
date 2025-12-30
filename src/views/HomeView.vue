<template>
  <div class="bg-[#f5f5f5] min-h-screen pb-10">
    <Navbar />
    
    <div class="container mx-auto px-4 pt-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-60 rounded-lg overflow-hidden">
        
        <div class="md:col-span-2 bg-gray-200 relative group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
            class="w-full h-full object-cover hover:opacity-95 transition"
            alt="Big Banner"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition">
             <div class="bg-black/30 text-white p-2 rounded-full hover:bg-black/50"><ChevronLeft /></div>
          </div>
          <div class="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition">
             <div class="bg-black/30 text-white p-2 rounded-full hover:bg-black/50"><ChevronRight /></div>
          </div>
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
             <div class="w-2 h-2 rounded-full bg-white/50"></div>
             <div class="w-2 h-2 rounded-full bg-shopee-primary border border-white"></div>
             <div class="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>

        <div class="hidden md:flex flex-col gap-2 h-full">
          <div class="flex-1 bg-orange-100 rounded-sm overflow-hidden relative cursor-pointer">
             <img src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
             <div class="absolute top-2 left-2 bg-yellow-400 text-red-600 text-[10px] font-bold px-1 rounded-sm">AD</div>
          </div>
          <div class="flex-1 bg-blue-100 rounded-sm overflow-hidden relative cursor-pointer">
             <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
             <div class="absolute bottom-2 right-2 text-white font-bold text-shadow">Diskon 50%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-6">
       <div class="bg-white p-4 rounded-sm shadow-sm">
          <div class="grid grid-cols-5 md:grid-cols-10 gap-y-4 gap-x-2">
             <div v-for="(cat, idx) in categories" :key="idx" class="flex flex-col items-center gap-2 cursor-pointer group hover:-translate-y-1 transition duration-200">
                <div class="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition">
                   <component :is="cat.icon" :size="20" :class="cat.color" />
                </div>
                <span class="text-[11px] text-gray-600 text-center leading-tight group-hover:text-shopee-primary">{{ cat.label }}</span>
             </div>
          </div>
       </div>
    </div>

    <div class="container mx-auto px-4 mb-6" v-if="products.length > 0">
       <div class="bg-white rounded-sm shadow-sm overflow-hidden">
          <div class="px-4 py-3 flex items-center justify-between border-b">
             <div class="flex items-center gap-4">
                <div class="text-xl font-extrabold text-shopee-primary italic flex items-center gap-1">
                   <Zap :size="24" class="fill-shopee-primary" /> FLASH SALE
                </div>
                <div class="flex items-center gap-1 text-white font-bold text-xs">
                   <span class="bg-black p-1 rounded-sm">02</span> : 
                   <span class="bg-black p-1 rounded-sm">14</span> : 
                   <span class="bg-black p-1 rounded-sm">30</span>
                </div>
             </div>
             <a href="#" class="text-shopee-primary text-sm font-medium hover:opacity-80 flex items-center">
                Lihat Semua <ChevronRight :size="16" />
             </a>
          </div>

          <div class="p-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
             <div v-for="product in products.slice(0, 6)" :key="product.id" class="min-w-[140px] max-w-[140px] cursor-pointer group">
                <div class="relative w-full aspect-square mb-2">
                   <img :src="product.image_url || 'https://placehold.co/300'" class="w-full h-full object-cover rounded-sm" />
                   <div class="absolute top-0 right-0 bg-yellow-400 text-red-600 font-bold text-xs px-1">
                      -50%
                   </div>
                </div>
                <div class="text-center">
                   <div class="text-shopee-primary font-bold text-lg">Rp{{ formatPrice(product.price) }}</div>
                   
                   <div class="relative w-full h-3 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div 
                        class="absolute top-0 left-0 h-full bg-red-500 transition-all duration-500" 
                        :style="{ width: Math.min((product.stock / 20) * 100, 100) + '%' }"
                      ></div>
                      <div class="absolute inset-0 flex items-center justify-center text-[9px] text-white font-bold uppercase z-10 drop-shadow-md">
                         Sisa {{ product.stock }}
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <div class="container mx-auto px-4">
      <div class="sticky top-[110px] z-30 bg-[#f5f5f5] pb-4 pt-2">
        <div class="bg-white p-0 rounded-sm shadow-sm border-b-4 border-shopee-primary flex text-center">
           <div class="flex-1 py-3 text-shopee-primary font-bold text-sm border-b border-white relative cursor-pointer hover:bg-gray-50">
              Rekomendasi
              <div class="absolute bottom-0 left-0 w-full h-1 bg-shopee-primary"></div> 
           </div>
           <div class="flex-1 py-3 text-gray-500 font-medium text-sm cursor-pointer hover:text-shopee-primary hover:bg-gray-50 transition">
              Terlaris
           </div>
           <div class="flex-1 py-3 text-gray-500 font-medium text-sm cursor-pointer hover:text-shopee-primary hover:bg-gray-50 transition">
              Harga Termurah
           </div>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
         <div v-for="n in 12" :key="n" class="bg-white h-72 rounded-sm animate-pulse"></div>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-8">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="bg-white hover:-translate-y-[2px] hover:shadow-[0_2px_12px_rgb(0,0,0,0.1)] transition-all duration-200 rounded-sm cursor-pointer group flex flex-col h-full border border-transparent hover:border-shopee-primary/30 relative"
        >
          
          <div class="aspect-square bg-gray-100 w-full relative overflow-hidden">
            <img 
              :src="product.image_url || 'https://placehold.co/300x300/png?text=Product'" 
              :class="{ 'grayscale opacity-80': product.stock <= 0 }"
              class="w-full h-full object-cover transition duration-300" 
              loading="lazy"
            />
            
            <div v-if="product.stock > 0" class="absolute top-0 right-0 bg-yellow-400 text-xs px-1.5 py-0.5 font-bold text-white z-10 shadow-sm">
              Star+
            </div>
            
            <div class="absolute top-0 left-0 bg-shopee-primary text-[10px] text-white px-1.5 py-0.5 rounded-br-md z-10 font-medium">
               Mall
            </div>

            <div v-if="product.stock <= 0" class="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-[1px]">
              <div class="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/50 tracking-wider">
                 HABIS
              </div>
            </div>

            <div v-if="product.stock > 0 && !(auth.user && auth.user.id === product.seller_id)" class="absolute bottom-0 left-0 w-full bg-shopee-primary/90 text-white text-center py-2 text-xs font-bold translate-y-full group-hover:translate-y-0 transition duration-300 z-10 flex items-center justify-center gap-1" @click.stop="addToCart(product)">
               <Plus :size="14" /> Keranjang
            </div>
          </div>

          <div class="p-2.5 flex flex-col flex-1 justify-between">
            <div>
               <h3 class="text-xs sm:text-sm text-gray-800 line-clamp-2 mb-1 leading-relaxed min-h-[36px]">
                  {{ product.name }}
               </h3>
               
               <div class="flex flex-wrap gap-1 mb-2">
                  <span class="text-[9px] border border-shopee-primary text-shopee-primary px-0.5 rounded-[2px]">Grosir</span>
                  <span class="text-[9px] bg-green-100 text-green-700 px-1 rounded-[2px] font-medium">Cod</span>
               </div>
            </div>
            
            <div>
              <div class="flex items-baseline gap-1 mt-1">
                 <span class="text-[10px] text-shopee-primary">Rp</span>
                 <span class="text-shopee-primary text-base sm:text-lg font-medium tracking-tight">
                    {{ formatPrice(product.price) }}
                 </span>
              </div>

              <div class="flex items-center justify-between mt-2 text-[10px] text-gray-500">
                <div class="flex items-center gap-0.5">
                   <Star :size="10" class="fill-yellow-400 text-yellow-400" />
                   <span>4.8</span>
                </div>
                <span :class="product.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-500'">
                   Stok: {{ product.stock }}
                </span>
              </div>
              
              <div class="mt-2 text-[10px] text-gray-400 flex items-center gap-1">
                 <MapPin :size="10" />
                 <span class="truncate max-w-[80px]">Jakarta Barat</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-if="!loading && products.length > 0" class="flex justify-center mt-6">
         <button class="bg-white border border-gray-300 px-10 py-2 text-gray-600 text-sm hover:bg-gray-50 hover:text-shopee-primary hover:border-shopee-primary transition rounded-sm shadow-sm">
            Lihat Lainnya
         </button>
      </div>

      <div v-if="!loading && products.length === 0" class="py-20 text-center flex flex-col items-center justify-center text-gray-400">
         <PackageOpen :size="64" class="opacity-30 mb-4" />
         <p>Belum ada produk tersedia.</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import { 
  ShoppingCart, Star, MapPin, Zap, ChevronRight, ChevronLeft, 
  Plus, PackageOpen, Smartphone, Shirt, Gift, Car, CreditCard, 
  Gamepad2, Utensils, Home, Briefcase 
} from 'lucide-vue-next';
import api from '../lib/axios'; 
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const products = ref<any[]>([]);
const loading = ref(true);

const auth = useAuthStore();
const cartStore = useCartStore();

// Static Categories Data
const categories = [
   { label: 'Elektronik', icon: Smartphone, color: 'text-blue-500' },
   { label: 'Pakaian Pria', icon: Shirt, color: 'text-indigo-500' },
   { label: 'Pakaian Wanita', icon: Gift, color: 'text-pink-500' },
   { label: 'Otomotif', icon: Car, color: 'text-red-500' },
   { label: 'Top Up', icon: CreditCard, color: 'text-green-500' },
   { label: 'Hobi & Koleksi', icon: Gamepad2, color: 'text-purple-500' },
   { label: 'Makanan', icon: Utensils, color: 'text-orange-500' },
   { label: 'Perlengkapan', icon: Home, color: 'text-teal-500' },
   { label: 'Kantor', icon: Briefcase, color: 'text-gray-600' },
   { label: 'Serba Serbi', icon: Star, color: 'text-yellow-500' },
];

const loadProducts = async () => {
  loading.value = true;
  try {
    const res = await api.get('/products');
    products.value = res.data.data;
  } catch (error) {
    console.error("Gagal ambil produk", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const addToCart = async (product: any) => {
  if(!auth.token) {
    alert("Silakan login terlebih dahulu untuk belanja!");
    return;
  }
  
  if (auth.user.id === product.seller_id) {
    alert("Anda tidak bisa membeli produk sendiri.");
    return;
  }

  if(product.stock <= 0) return;
  
  try {
    await cartStore.addToCart(product.id, 1);
    alert('Produk berhasil ditambahkan ke keranjang!');
  } catch (e: any) {
    console.error(e);
    alert(e.response?.data?.error || 'Gagal tambah keranjang');
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.text-shadow {
   text-shadow: 0px 1px 2px rgba(0,0,0,0.5);
}
</style>