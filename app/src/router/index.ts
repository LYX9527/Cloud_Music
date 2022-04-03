import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import Index from '@/views/index.vue'
import Home from '@/views/page/home.vue'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Index,
        redirect: '/index/home',
        children: [
            {
                path: '/index/home',
                name: "Home",
                component: Home
            },
            {
                path: '/index/found',
                name: "Found",
                component: () => import("@/views/page/found.vue")
            },
            {
                path: '/index/playlist',
                name: "List",
                component: () => import("@/views/page/playlist.vue")
            }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/login.vue"),
    },
]

const router = createRouter({
    history: createWebHistory("cloudMusic"),
    routes
})

export default router