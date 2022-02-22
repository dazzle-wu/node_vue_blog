import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Reset from '../views/Reset.vue'
import Main from '../views/Main.vue'
import Console from '../views/Console/Console.vue'
import Article from '../views/Console/Article.vue'
import Category from '../views/Console/Category.vue'
import User from '../views/Console/User.vue'
import AddArticle from '../views/article/Add.vue'
import ArticleDetail from '../views/article/Detail.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/reset', component: Reset },
  {
    path: '/',
    component: Home,
    children: [
      { path: '/', component: Main },
      { path: '/article/:aid', component: ArticleDetail, props: true },
      {
        path: '/console',
        component: Console,
        redirect: '/console/article',
        children: [
          { path: 'article', component: Article },
          { path: 'category', component: Category },
          { path: 'user', component: User }
        ]
      }
    ]
  },
  { path: '/article/write', component: AddArticle }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register' || to.path === '/reset') return next()
  if (!localStorage.token) return next('/login')
  next()
})

export default router