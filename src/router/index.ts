import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/technologies',
      name: 'Technologies',
      component: () => import('@/pages/TechnologiesPage.vue'),
    },
    {
      path: '/economics',
      name: 'Economics',
      component: () => import('@/pages/EconomicsPage.vue'),
    },
    {
      path: '/experiences',
      name: 'Experiences',
      component: () => import('@/pages/ExperiencesPage.vue'),
    },
    {
      path: '/administration',
      name: 'Administration',
      component: () => import('@/pages/AdministrationPage.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/pages/AboutPage.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/pages/ContactPage.vue'),
    },
    {
      path: '/blogs',
      name: 'Blogs',
      component: () => import('@/pages/BlogsPage.vue'),
    },
  ],
})

export default router
