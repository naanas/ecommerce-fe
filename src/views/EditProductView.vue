<template>
  <Navbar />
  <div class="min-h-screen bg-gray-100 pb-10">
    <div class="container mx-auto px-4 py-6 max-w-3xl">
      <div class="bg-white p-6 rounded shadow-sm mb-4">
        <h1 class="text-xl font-bold text-gray-800">Ubah Produk</h1>
      </div>

      <form @submit.prevent="updateProduct" class="bg-white p-6 rounded shadow-sm" v-if="!loadingData">
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
          <input v-model="form.name" type="text" class="w-full border rounded p-2 focus:border-shopee-primary outline-none" required />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea v-model="form.description" rows="5" class="w-full border rounded p-2 focus:border-shopee-primary outline-none"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
            <input v-model="form.price" type="number" class="w-full border rounded p-2 focus:border-shopee-primary outline-none" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stok</label>
            <input v-model="form.stock" type="number" class="w-full border rounded p-2 focus:border-shopee-primary outline-none" required />
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL Gambar</label>
          <input v-model="form.image_url" type="text" class="w-full border rounded p-2 focus:border-shopee-primary outline-none" required />
          <div class="mt-2" v-if="form.image_url">
             <img :src="form.image_url" class="h-32 object-contain border bg-gray-50">
          </div>
        </div>

        <div class="flex justify-end gap-4 border-t pt-4">
          <button type="button" @click="router.back()" class="px-6 py-2 rounded text-gray-600 hover:bg-gray-100">Batal</button>
          <button type="submit" :disabled="submitting" class="bg-shopee-primary text-white px-8 py-2 rounded shadow hover:bg-orange-600 font-medium">
            {{ submitting ? 'Menyimpan...' : 'Update Produk' }}
          </button>
        </div>
      </form>
      
      <div v-else class="text-center py-10">Mengambil data produk...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { useAuthStore } from '../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const loadingData = ref(true);
const submitting = ref(false);
const form = reactive({ name: '', description: '', price: 0, stock: 0, image_url: '' });

const api = axios.create({ baseURL: 'https://ecommerce-api-topaz-iota.vercel.app/api' });

onMounted(async () => {
  try {
    const { id } = route.params;
    const res = await api.get(`/products/${id}`); // Ambil data lama
    const data = res.data.data;
    
    // Isi form dengan data lama
    form.name = data.name;
    form.description = data.description;
    form.price = data.price;
    form.stock = data.stock;
    form.image_url = data.image_url;
  } catch (error) {
    alert("Produk tidak ditemukan");
    router.push('/seller/my-shop');
  } finally {
    loadingData.value = false;
  }
});

const updateProduct = async () => {
  submitting.value = true;
  try {
    const { id } = route.params;
    await api.put(`/products/${id}`, form, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    alert("Produk berhasil diupdate!");
    router.push('/seller/my-shop');
  } catch (error: any) {
    alert(error.response?.data?.error || "Gagal update");
  } finally {
    submitting.value = false;
  }
};
</script>