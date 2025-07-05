import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import IndexView from "@/views/IndexView.vue";
import LoginView from "@/views/LoginView.vue";
import ClassView from "@/views/index/ClassView.vue";
import EmptyView from "@/views/EmptyView.vue";
import ClassDetail from "@/views/index/ClassDetail.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: IndexView,
    children: [
      {
        path: '',
        name: 'class',
        component: ClassView,
      },
      {
        path: 'detail',
        name: 'detail',
        component: ClassDetail
      },
      {
        path: ':childPathMatch(.*)*',
        name: 'sub-not-found',
        component: EmptyView,
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: EmptyView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
