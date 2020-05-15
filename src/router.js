import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './components/Home.vue'
import Make from './components/Make.vue'
import Join from './components/Join.vue'
import Game from './components/Game/Game.vue'
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
    tab: "home",
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
    name: 'dealer',
    component: Game,
    props: (route) => ({
      query: route.query.is_dealer
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
    props: route.props,
    beforeEnter: (to, from, next) => {
      // cache home tab
      if (route.tab != "home") {
        store.dispatch('updateHomeTab', from)
      } 
      // apply cached home tab then remove it
      if (route.name == "dummy") {
        next(store.state.homeTab.route || routes[0])
        store.dispatch('clearHomeTab')
      } else {
        next()
      }
    }
  }))
})

export default router