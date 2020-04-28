import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Make from './components/Make.vue'
import Join from './components/Join.vue'
import Game from './components/Game.vue'
import About from './components/About.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/make',
      name: 'make',
      component: Make,
    },
    {
      path: '/join',
      name: 'join',
      component: Join,
    },
    {
      path: '/game/:code/:player',
      name: 'game',
      component: Game,
      props: true,
    },
    {
      path: '/game/:code',
      name: 'owner',
      component: Game,
      props: (route) => ({
        query: route.query.is_owner
      }),
    },
    {
      path: '/about/',
      name: 'about',
      component: About,
    },
  ]
})

export default router