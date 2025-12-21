<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 pb-10">
    <div class="container mx-auto px-4 py-6">
      
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Toko Saya</h1>
        <router-link to="/seller/add-product" class="bg-shopee-primary text-white px-4 py-2 rounded shadow hover:bg-orange-600 flex items-center gap-2">
           + Tambah Produk Baru
        </router-link>
      </div>

      <div class="bg-white rounded shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="p-4 text-sm font-medium text-gray-600">Info Produk</th>
              <th class="p-4 text-sm font-medium text-gray-600">Harga</th>
              <th class="p-4 text-sm font-medium text-gray-600 text-center">Stok</th>
              <th class="p-4 text-sm font-medium text-gray-600 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-if="products.length === 0">
               <td colspan="4" class="p-8 text-center text-gray-500">Belum ada produk yang dijual.</td>
            </tr>
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50">
              <td class="p-4 flex gap-4 items-center max-w-md">
                 <img :src="product.image_url" class="w-16 h-16 object-cover border rounded bg-gray-100" />
                 <div>
                    <p class="font-medium line-clamp-1">{{ product.name }}</p>
                    <p class="text-xs text-gray-400 line-clamp-2">{{ product.description }}</p>
                 </div>
              </td>
              <td class="p-4 text-shopee-primary font-medium">Rp{{ formatPrice(product.price) }}</td>
              <td class="p-4 text-center">
                 <span :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded text-xs font-bold">
                    {{ product.stock }}
                 </span>
              </td>
              <td class="p-4 text-center">
                 <div class="flex justify-center gap-2">
                    <button @click="router.push(`/seller/edit-product/${product.id}`)" class="text-blue-500 hover:underline text-sm font-medium">Ubah</button>
                    <span class="text-gray-300">|</span>
                    <button @click="deleteProduct(product.id)" class="text-red-500 hover:underline text-sm font-medium">Hapus</button>
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const products = ref<any[]>([]);
const auth = useAuthStore();
const router = useRouter();
const api = axios.create({ baseURL: 'http://localhost:4000/api' });

const loadMyProducts = async () => {
  try {
    const res = await api.get('/seller/products', {
       headers: { Authorization: `Bearer ${auth.token}` }
    });
    products.value = res.data.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteProduct = async (id: string) => {
  if(!confirm("Yakin ingin menghapus produk ini selamanya?")) return;
  
  try {
    await api.delete(`/products/${id}`, {
       headers: { Authorization: `Bearer ${auth.token}` }
    });
    loadMyProducts(); // Refresh list
  } catch (error) {
    alert("Gagal menghapus produk");
  }
};

const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

onMounted(() => {
  if (auth.user.role !== 'SELLER') return router.push('/');
  loadMyProducts();
});
</script>