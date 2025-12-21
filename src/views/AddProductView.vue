<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 pb-10">
    <div class="container mx-auto px-4 py-6 max-w-3xl">
      
      <div class="bg-white p-6 rounded shadow-sm mb-4">
        <h1 class="text-xl font-bold text-gray-800">Tambah Produk Baru</h1>
        <p class="text-sm text-gray-500">Pastikan produk tidak melanggar ketentuan ShopeeClone.</p>
      </div>

      <form @submit.prevent="submitProduct" class="bg-white p-6 rounded shadow-sm">
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
          <div class="relative">
             <input v-model="form.name" type="text" class="w-full border rounded p-2 focus:outline-none focus:border-shopee-primary" placeholder="Contoh: Sepatu Pria Keren" required />
             <span class="absolute right-2 top-2 text-xs text-gray-400">{{ form.name.length }}/100</span>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Produk</label>
          <textarea v-model="form.description" rows="5" class="w-full border rounded p-2 focus:outline-none focus:border-shopee-primary" placeholder="Jelaskan spesifikasi, ukuran, bahan, dll." required></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
            <div class="relative">
               <span class="absolute left-3 top-2 text-gray-500">Rp</span>
               <input v-model="form.price" type="number" class="w-full border rounded p-2 pl-10 focus:outline-none focus:border-shopee-primary" placeholder="0" required />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input v-model="form.stock" type="number" class="w-full border rounded p-2 focus:outline-none focus:border-shopee-primary" placeholder="0" required />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar Produk</label>
          <input v-model="form.image_url" type="text" class="w-full border rounded p-2 focus:outline-none focus:border-shopee-primary" placeholder="https://..." required />
          
          <div v-if="form.image_url" class="mt-2 border border-dashed p-2 inline-block rounded">
             <img :src="form.image_url" class="w-32 h-32 object-cover" alt="Preview" @error="imageError = true">
             <p v-if="imageError" class="text-xs text-red-500 mt-1">Gambar tidak valid</p>
          </div>
        </div>

        <div class="flex justify-end gap-4 border-t pt-4">
          <button type="button" @click="router.back()" class="px-6 py-2 rounded text-gray-600 hover:bg-gray-100">Batal</button>
          <button type="submit" :disabled="loading" class="bg-shopee-primary text-white px-8 py-2 rounded shadow hover:bg-orange-600 disabled:opacity-50 font-medium">
            {{ loading ? 'Menyimpan...' : 'Simpan & Tampilkan' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();
const loading = ref(false);
const imageError = ref(false);

const form = reactive({
  name: '',
  description: '',
  price: '',
  stock: '',
  image_url: ''
});

const submitProduct = async () => {
  if (!auth.token) return alert("Sesi habis, silakan login ulang.");
  
  loading.value = true;
  try {
    await axios.post('http://localhost:4000/api/products', {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });

    alert("Produk berhasil ditambahkan!");
    router.push('/'); // Balik ke home biar langsung kelihatan produknya
  } catch (error: any) {
    console.error(error);
    alert(error.response?.data?.error || "Gagal menambahkan produk");
  } finally {
    loading.value = false;
  }
};
</script>