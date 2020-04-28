import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './components/Home.vue'
import Make from './components/Make.vue'
import Join from './components/Join.vue'
import Game from './components/Game.vue'
import About from './components/About.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    tab: "home",
  },
  {
    path: '/home',
    name: 'dummy',
  },
  {
    path: '/make',
    name: 'make',
    component: Make,
    tab: "home",
  },
  {
    path: '/join',
    name: 'join',
    component: Join,
    tab: "home",
  },
  {
    path: '/game/:code/:player',
    name: 'game',
    component: Game,
    props: true,
    tab: "home",
  },
  {
    path: '/game/:code',
    name: 'owner',
    component: Game,
    props: (route) => ({
      query: route.query.is_owner
    }),
    tab: "home",
  },
  {
    path: '/about/',
    name: 'about',
    component: About,
    tab: "about",
  },
]

const router = new Router({
  mode: 'hash',
  routes: routes.map(route => ({
    name: route.name,
    path: route.path,
    component: route.component,
    beforeEnter: (to, from, next) => {
      if (route.tab == "home") {
        store.dispatch('updateHomeTab', to)
      }
      if (to.path == "/home") {
        next(store.state.homeTab.route
          ? store.state.homeTab.route
          : routes[0])
      } else {
        next()
      }
    }
  }))
})

export default router