import Vue from 'vue'
import Router from 'vue-router'
import Firebase from 'firebase'
import App from './App.vue'
import Home from './components/Home.vue'
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
      path: '/about/',
      name: 'about',
      component: About,
    },
  ]
})

const { firebaseConfig } = require('./firebase/init.js');
const database = Firebase.initializeApp(firebaseConfig).database().ref();
Vue.prototype.$database = database;

new Vue({
  el: '#app',
  render: h => h(App),
  router,
})
