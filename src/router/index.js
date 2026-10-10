import { nextTick, watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import i18n from '../i18n'
import { resolveProjectDetailRoute } from './guards'

const Home = () => import('../views/Home.vue')
const About = () => import('../views/About.vue')
const Projects = () => import('../views/Projects.vue')
const Contact = () => import('../views/Contact.vue')
const ProjectDetail = () => import('../views/ProjectDetail.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { titleKey: 'meta.home.title', descriptionKey: 'meta.home.description' } },
  { path: '/about', name: 'About', component: About, meta: { titleKey: 'meta.about.title', descriptionKey: 'meta.about.description' } },
  { path: '/projects', name: 'Projects', component: Projects, meta: { titleKey: 'meta.projects.title', descriptionKey: 'meta.projects.description' } },
  { path: '/contact', name: 'Contact', component: Contact, meta: { titleKey: 'meta.contact.title', descriptionKey: 'meta.contact.description' } },
  {
    path: '/projects/:slug',
    name: 'ProjectDetail',
    component: ProjectDetail,
    props: true
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { titleKey: 'meta.notFound.title' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    // 首頁卡片會連到作品集頁面上的專案卡片（例如 /projects#project-tagTwin）；
    // Vue Router 用 scrollTo 捲動，不會套用 scroll-padding，要自己扣掉固定在上方的導覽列
    if (to.hash) {
      const topBar = document.querySelector('.ts-app-topbar')
      return { el: to.hash, top: (topBar?.offsetHeight ?? 0) + 16 }
    }
    return { top: 0 }
  }
})

// GitHub Pages 會把資料夾形式的網址導向結尾斜線（例如 /projects/），站內統一去掉
router.beforeEach(to => {
  if (to.path.length > 1 && to.path.endsWith('/')) {
    return {
      path: to.path.replace(/\/+$/, ''),
      query: to.query,
      hash: to.hash,
      replace: true
    }
  }
})

router.beforeEach(resolveProjectDetailRoute)

const updateDocumentMeta = route => {
  document.title = route.meta.titleKey
    ? i18n.global.t(route.meta.titleKey)
    : 'KageRyo Developer'

  // 沒有專屬描述的頁面（例如 404）沿用首頁描述
  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.content = i18n.global.t(route.meta.descriptionKey ?? 'meta.home.description')
  }
}

router.afterEach(async to => {
  updateDocumentMeta(to)
  await nextTick()
  document.querySelector('#main-content')?.focus({ preventScroll: true })
})

watch(i18n.global.locale, () => {
  updateDocumentMeta(router.currentRoute.value)
})

export default router
