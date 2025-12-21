import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import CartView from '../views/CartView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import OrderHistoryView from '../views/OrderHistoryView.vue'
import AddProductView from '../views/AddProductView.vue'
import MyProductsView from '../views/MyProductsView.vue'
import EditProductView from '../views/EditProductView.vue'
import PaymentSuccessView from '../views/PaymentSuccessView.vue' // 👈 Import ini

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView },
    { path: '/cart', component: CartView },
    { path: '/checkout', component: CheckoutView },
    { path: '/orders', component: OrderHistoryView },
    
    // Seller Routes
    { path: '/seller/add-product', component: AddProductView },
    { path: '/seller/my-shop', component: MyProductsView },
    { path: '/seller/edit-product/:id', component: EditProductView },

    // 🔥 Route Baru: Payment Success 🔥
    { path: '/payment-success', component: PaymentSuccessView },
  ]
})

export default router